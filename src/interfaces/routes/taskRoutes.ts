import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateUserId,
} from '../../infrastructure/middleware/validators';

export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  router.get('/user/:userId', validateUserId, taskController.getTasksByUser);
  router.post('/', validateCreateTask, taskController.createTask);
  router.put('/:id', validateUpdateTask, taskController.updateTask);
  router.delete('/:id', validateTaskId, taskController.deleteTask);

  return router;
};
