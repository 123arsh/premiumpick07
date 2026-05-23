import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Admin } from '../models/Admin.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token =
    req.cookies?.admin_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    throw new AppError('Not authorized. Please log in.', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.purpose && decoded.purpose !== 'auth') {
    throw new AppError('Not authorized. Please log in.', 401);
  }

  const admin = await Admin.findById(decoded.id);

  if (!admin) {
    throw new AppError('Admin no longer exists.', 401);
  }

  req.admin = { id: admin._id, username: admin.username };
  next();
});
