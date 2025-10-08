import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { Task } from '../../domain/entities/Task';
import { FirebaseConnection } from './firebaseConfig';
import { NotFoundError, InternalError } from '../errors/AppError';

export class FirestoreTaskRepository implements TaskRepository {
  private readonly collectionName = 'tasks';

  async findByUserId(userId: string): Promise<Task[]> {
    try {
      const db = FirebaseConnection.getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((doc) => Task.fromFirestore(doc.id, doc.data()));
    } catch (error) {
      throw new InternalError(`Failed to find tasks by user: ${(error as Error).message}`);
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const db = FirebaseConnection.getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return Task.fromFirestore(doc.id, doc.data() as Record<string, unknown>);
    } catch (error) {
      throw new InternalError(`Failed to find task by ID: ${(error as Error).message}`);
    }
  }

  async create(task: Task): Promise<Task> {
    try {
      const db = FirebaseConnection.getFirestore();
      const docRef = await db.collection(this.collectionName).add(task.toObject());
      const doc = await docRef.get();

      return Task.fromFirestore(doc.id, doc.data() as Record<string, unknown>);
    } catch (error) {
      throw new InternalError(`Failed to create task: ${(error as Error).message}`);
    }
  }

  async update(task: Task): Promise<Task> {
    try {
      if (!task.id) {
        throw new Error('Task ID is required for update');
      }

      const db = FirebaseConnection.getFirestore();
      const docRef = db.collection(this.collectionName).doc(task.id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundError('Task not found');
      }

      await docRef.update(task.toObject());
      const updatedDoc = await docRef.get();

      return Task.fromFirestore(updatedDoc.id, updatedDoc.data() as Record<string, unknown>);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalError(`Failed to update task: ${(error as Error).message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = FirebaseConnection.getFirestore();
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundError('Task not found');
      }

      await docRef.delete();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalError(`Failed to delete task: ${(error as Error).message}`);
    }
  }
}
