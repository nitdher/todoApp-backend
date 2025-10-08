import { Request, Response, NextFunction } from 'express';
import { GetUserByEmailUseCase } from '../../application/useCases/users/GetUserByEmailUseCase';
import { CreateUserUseCase } from '../../application/useCases/users/CreateUserUseCase';

export class UserController {
  constructor(
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  getUserByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await this.getUserByEmailUseCase.execute(email);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user.toObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await this.createUserUseCase.execute(email);

      res.status(201).json({
        success: true,
        data: user.toObject(),
      });
    } catch (error) {
      next(error);
    }
  };
}
