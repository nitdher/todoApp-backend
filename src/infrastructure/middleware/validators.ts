import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppError';

export const handleValidationErrors = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => `${err.type === 'field' ? err.path : 'field'}: ${err.msg}`)
      .join(', ');
    throw new ValidationError(errorMessages);
  }
  next();
};

export const validateUserEmail = [
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .trim(),
  handleValidationErrors,
];

export const validateCreateTask = [
  body('userId')
    .exists().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string')
    .trim()
    .notEmpty().withMessage('User ID cannot be empty'),
  body('title')
    .exists().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .exists().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .trim(),
  body('completed')
    .exists().withMessage('Completed status is required')
    .isBoolean().withMessage('Completed must be a boolean'),
  handleValidationErrors,
];

export const validateUpdateTask = [
  param('id')
    .exists().withMessage('Task ID is required')
    .isString().withMessage('Task ID must be a string')
    .trim()
    .notEmpty().withMessage('Task ID cannot be empty'),
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim(),
  body('completed')
    .optional()
    .isBoolean().withMessage('Completed must be a boolean'),
  handleValidationErrors,
];

export const validateTaskId = [
  param('id')
    .exists().withMessage('Task ID is required')
    .isString().withMessage('Task ID must be a string')
    .trim()
    .notEmpty().withMessage('Task ID cannot be empty'),
  handleValidationErrors,
];

export const validateUserId = [
  param('userId')
    .exists().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string')
    .trim()
    .notEmpty().withMessage('User ID cannot be empty'),
  handleValidationErrors,
];
