import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const user = new User({ email });
    return await this.userRepository.create(user);
  }
}
