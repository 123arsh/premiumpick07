import jwt from 'jsonwebtoken';

export const generateToken = (adminId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  return jwt.sign({ id: adminId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};
