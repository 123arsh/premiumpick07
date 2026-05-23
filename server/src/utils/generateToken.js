import jwt from 'jsonwebtoken';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  return secret;
};

export const generateToken = (adminId) => {
  return jwt.sign({ id: adminId, purpose: 'auth' }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const generateResetToken = (adminId) => {
  return jwt.sign({ id: adminId, purpose: 'password_reset' }, getSecret(), {
    expiresIn: '15m',
  });
};

export const verifyResetToken = (token) => {
  const decoded = jwt.verify(token, getSecret());
  if (decoded.purpose !== 'password_reset' || !decoded.id) {
    throw new Error('Invalid reset token');
  }
  return decoded.id;
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
