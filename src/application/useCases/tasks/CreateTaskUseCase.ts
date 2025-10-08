import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { Task } from '../../../domain/entities/Task';

export interface CreateTaskDTO {
  userId: string;
  title: string;
  description: string;
  completed: boolean;
}

/**
 * Caso de uso para crear una nueva tarea.
 *
 * Maneja la lógica de negocio para la creación de tareas,
 * validando los datos mediante la entidad de dominio antes de persistir.
 */
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * Ejecuta la creación de una nueva tarea.
   *
   * @param data - Datos de la tarea a crear
   * @returns Tarea creada con su ID asignado
   */
  async execute(data: CreateTaskDTO): Promise<Task> {
    const task = new Task(data);
    return await this.taskRepository.create(task);
  }
}
