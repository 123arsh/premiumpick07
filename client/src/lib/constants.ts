export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAdminBasePath = () => {
  const path = process.env.ADMIN_PATH || 'cp-internal-manage';
  return `/${path}`;
};
