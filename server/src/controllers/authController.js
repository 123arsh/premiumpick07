import { Admin } from '../models/Admin.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken, setTokenCookie } from '../utils/generateToken.js';

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
