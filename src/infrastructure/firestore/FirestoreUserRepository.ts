import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { FirebaseConnection } from './firebaseConfig';
import { ConflictError, InternalError } from '../errors/AppError';

export class FirestoreUserRepository implements UserRepository {
  private readonly collectionName = 'users';

  async findByEmail(email: string): Promise<User | null> {
    try {
      const db = FirebaseConnection.getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return User.fromFirestore(doc.id, doc.data());
    } catch (error) {
      throw new InternalError(`Failed to find user by email: ${(error as Error).message}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const existing = await this.findByEmail(user.email);
      if (existing) {
        throw new ConflictError('User already exists');
      }

      const db = FirebaseConnection.getFirestore();
      const docRef = await db.collection(this.collectionName).add(user.toObject());
      const doc = await docRef.get();

      return User.fromFirestore(doc.id, doc.data() as Record<string, unknown>);
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new InternalError(`Failed to create user: ${(error as Error).message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = FirebaseConnection.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error) {
      throw new InternalError(`Failed to delete user: ${(error as Error).message}`);
    }
  }
}
