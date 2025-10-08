import { GetUserByEmailUseCase } from './GetUserByEmailUseCase';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';

describe('GetUserByEmailUseCase', () => {
  let useCase: GetUserByEmailUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  const mockUser = new User({
    id: 'test-user-123',
    email: 'test@example.com',
    createdAt: new Date('2025-10-07'),
  });

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new GetUserByEmailUseCase(mockUserRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return user when found by email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await useCase.execute('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await useCase.execute('notfound@example.com');

      expect(result).toBeNull();
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('notfound@example.com');
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database connection failed');
      mockUserRepository.findByEmail.mockRejectedValue(error);

      await expect(useCase.execute('test@example.com')).rejects.toThrow('Database connection failed');
    });
  });
});
