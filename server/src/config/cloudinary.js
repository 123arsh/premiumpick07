import { v2 as cloudinary } from 'cloudinary';

export const isCloudinaryEnabled = () =>
  process.env.UPLOAD_PROVIDER === 'cloudinary' || process.env.NODE_ENV === 'production';

export const validateCloudinaryConfig = () => {
  if (!isCloudinaryEnabled()) return;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      'Cloudinary is required in production. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on Render.'
    );
  }

  if (CLOUDINARY_API_KEY === CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be different values.');
  }
};

export const configureCloudinary = () => {
  if (!isCloudinaryEnabled()) return;

  validateCloudinaryConfig();

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  console.log('Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
};

export { cloudinary };
