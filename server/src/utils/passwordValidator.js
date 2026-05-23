import { AppError } from './AppError.js';

export const assertPasswordStrength = (password, fieldName = 'Password') => {
  if (!password || password.length < 8) {
    throw new AppError(`${fieldName} must be at least 8 characters`, 400);
  }
};
