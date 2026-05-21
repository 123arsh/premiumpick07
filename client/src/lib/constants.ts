const DEFAULT_API_URL = 'https://premiumpick07.onrender.com/api';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

export const getAdminBasePath = () => {
  const path = process.env.ADMIN_PATH || 'cp-internal-manage';
  return `/${path}`;
};
