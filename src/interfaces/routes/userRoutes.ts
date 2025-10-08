import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateUserEmail } from '../../infrastructure/middleware/validators';

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  router.post('/check', validateUserEmail, userController.getUserByEmail);
  router.post('/', validateUserEmail, userController.createUser);

  return router;
};
