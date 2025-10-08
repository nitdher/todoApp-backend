import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { Task } from '../../../domain/entities/Task';
import { NotFoundError } from '../../../infrastructure/errors/AppError';

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, data: UpdateTaskDTO): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    task.update(data);
    return await this.taskRepository.update(task);
  }
}
