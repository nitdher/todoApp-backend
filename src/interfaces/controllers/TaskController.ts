import { Request, Response, NextFunction } from 'express';
import { GetTasksByUserUseCase } from '../../application/useCases/tasks/GetTasksByUserUseCase';
import { CreateTaskUseCase } from '../../application/useCases/tasks/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../../application/useCases/tasks/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/useCases/tasks/DeleteTaskUseCase';

export class TaskController {
  constructor(
    private readonly getTasksByUserUseCase: GetTasksByUserUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase
  ) {}

  getTasksByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const tasks = await this.getTasksByUserUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: tasks.map((task) => task.toObject()),
      });
    } catch (error) {
      next(error);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, title, description, completed } = req.body;
      const task = await this.createTaskUseCase.execute({
        userId,
        title,
        description,
        completed,
      });

      res.status(201).json({
        success: true,
        data: task.toObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;
      const task = await this.updateTaskUseCase.execute(id, {
        title,
        description,
        completed,
      });

      res.status(200).json({
        success: true,
        data: task.toObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteTaskUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
