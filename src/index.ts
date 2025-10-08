import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FirebaseConnection } from './infrastructure/firestore/firebaseConfig';
import { RepositoryFactory } from './infrastructure/factories/RepositoryFactory';
import { GetUserByEmailUseCase } from './application/useCases/users/GetUserByEmailUseCase';
import { CreateUserUseCase } from './application/useCases/users/CreateUserUseCase';
import { GetTasksByUserUseCase } from './application/useCases/tasks/GetTasksByUserUseCase';
import { CreateTaskUseCase } from './application/useCases/tasks/CreateTaskUseCase';
import { UpdateTaskUseCase } from './application/useCases/tasks/UpdateTaskUseCase';
import { DeleteTaskUseCase } from './application/useCases/tasks/DeleteTaskUseCase';
import { UserController } from './interfaces/controllers/UserController';
import { TaskController } from './interfaces/controllers/TaskController';
import { createUserRoutes } from './interfaces/routes/userRoutes';
import { createTaskRoutes } from './interfaces/routes/taskRoutes';
import { errorHandler } from './infrastructure/middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

FirebaseConnection.getApp();

const userRepository = RepositoryFactory.createUserRepository();
const taskRepository = RepositoryFactory.createTaskRepository();

const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const getTasksByUserUseCase = new GetTasksByUserUseCase(taskRepository);
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

const userController = new UserController(getUserByEmailUseCase, createUserUseCase);
const taskController = new TaskController(
  getTasksByUserUseCase,
  createTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase
);

app.use('/api/users', createUserRoutes(userController));
app.use('/api/tasks', createTaskRoutes(taskController));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
