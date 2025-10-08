import { UserRepository } from '../../domain/repositories/UserRepository';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { FirestoreUserRepository } from '../firestore/FirestoreUserRepository';
import { FirestoreTaskRepository } from '../firestore/FirestoreTaskRepository';

export class RepositoryFactory {
  private static userRepositoryInstance: UserRepository;
  private static taskRepositoryInstance: TaskRepository;

  static createUserRepository(): UserRepository {
    if (!this.userRepositoryInstance) {
      this.userRepositoryInstance = new FirestoreUserRepository();
    }
    return this.userRepositoryInstance;
  }

  static createTaskRepository(): TaskRepository {
    if (!this.taskRepositoryInstance) {
      this.taskRepositoryInstance = new FirestoreTaskRepository();
    }
    return this.taskRepositoryInstance;
  }
}
