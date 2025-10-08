import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';

/**
 * Caso de uso para buscar un usuario por su email.
 *
 * Implementa la lógica de negocio para verificar si un usuario
 * existe en el sistema mediante su dirección de correo electrónico.
 */
export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Ejecuta la búsqueda de usuario por email.
   *
   * @param email - Email del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */
  async execute(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
}
