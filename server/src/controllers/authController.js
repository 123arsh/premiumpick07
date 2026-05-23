import { Admin } from '../models/Admin.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  generateToken,
  generateResetToken,
  verifyResetToken,
  setTokenCookie,
} from '../utils/generateToken.js';
import { assertPasswordStrength } from '../utils/passwordValidator.js';

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username: username?.toLowerCase() }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(admin._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    data: {
      token,
      admin: { id: admin._id, username: admin.username },
    },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.cookie('admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  res.json({ success: true, message: 'Logged out' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { admin: req.admin },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin.id).select('+password');
  if (!admin) {
    throw new AppError('Admin not found', 404);
  }

  if (!(await admin.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }

  assertPasswordStrength(newPassword, 'New password');

  admin.password = newPassword;
  await admin.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { username, resetSecret } = req.body;
  const expectedSecret = process.env.ADMIN_RESET_SECRET;

  if (!expectedSecret) {
    throw new AppError('Password reset is not configured on the server', 503);
  }

  const admin = await Admin.findOne({ username: username?.toLowerCase() });

  if (!admin || resetSecret !== expectedSecret) {
    throw new AppError('Invalid username or recovery secret', 401);
  }

  const resetToken = generateResetToken(admin._id);

  res.json({
    success: true,
    message: 'Recovery verified. Set your new password below.',
    data: { resetToken },
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }

  assertPasswordStrength(newPassword, 'New password');

  let adminId;
  try {
    adminId = verifyResetToken(token);
  } catch {
    throw new AppError('Reset link expired or invalid. Request a new one.', 400);
  }

  const admin = await Admin.findById(adminId).select('+password');
  if (!admin) {
    throw new AppError('Admin account not found', 404);
  }

  admin.password = newPassword;
  await admin.save();

  res.json({ success: true, message: 'Password reset successfully. You can sign in now.' });
});
