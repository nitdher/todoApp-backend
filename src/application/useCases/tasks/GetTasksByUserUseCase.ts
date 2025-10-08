import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { Task } from '../../../domain/entities/Task';

export class GetTasksByUserUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    return await this.taskRepository.findByUserId(userId);
  }
}
