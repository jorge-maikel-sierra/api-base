import { AppError } from './AppError.js';

export default class ValidationError extends AppError {
  constructor(message = 'Error de validación') {
    super(message, 422, 'VALIDATION_ERROR');
  }
}
