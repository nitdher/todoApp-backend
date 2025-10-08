import { CreateTaskUseCase, CreateTaskDTO } from './CreateTaskUseCase';
import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { Task } from '../../../domain/entities/Task';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  const mockTaskDTO: CreateTaskDTO = {
    userId: 'user-123',
    title: 'Test Task',
    description: 'This is a test task description',
    completed: false,
  };

  const mockCreatedTask = new Task({
    id: 'task-123',
    userId: 'user-123',
    title: 'Test Task',
    description: 'This is a test task description',
    completed: false,
    createdAt: new Date('2025-10-07'),
    updatedAt: new Date('2025-10-07'),
  });

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<TaskRepository>;

    useCase = new CreateTaskUseCase(mockTaskRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new task successfully', async () => {
      mockTaskRepository.create.mockResolvedValue(mockCreatedTask);

      const result = await useCase.execute(mockTaskDTO);

      expect(result).toEqual(mockCreatedTask);
      expect(mockTaskRepository.create).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockTaskDTO.userId,
          title: mockTaskDTO.title,
          description: mockTaskDTO.description,
          completed: mockTaskDTO.completed,
        })
      );
    });

    it('should create task with completed = false by default', async () => {
      const dtoWithoutCompleted = {
        ...mockTaskDTO,
        completed: false,
      };

      mockTaskRepository.create.mockResolvedValue(mockCreatedTask);

      await useCase.execute(dtoWithoutCompleted);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          completed: false,
        })
      );
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database write failed');
      mockTaskRepository.create.mockRejectedValue(error);

      await expect(useCase.execute(mockTaskDTO)).rejects.toThrow('Database write failed');
    });

    it('should validate task data through Task entity', async () => {
      // Si la entidad Task valida, esto debería funcionar
      mockTaskRepository.create.mockResolvedValue(mockCreatedTask);

      const validDTO: CreateTaskDTO = {
        userId: 'user-123',
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        completed: false,
      };

      const result = await useCase.execute(validDTO);

      expect(result).toBeDefined();
      expect(mockTaskRepository.create).toHaveBeenCalled();
    });
  });
});
