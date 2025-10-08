import { Task } from '../entities/Task';

export interface TaskRepository {
  findByUserId(userId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
}
