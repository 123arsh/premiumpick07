import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { cloudinary, isCloudinaryEnabled } from '../config/cloudinary.js';
import { AppError } from './AppError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');

const uploadToCloudinary = async (buffer) => {
  const dataUri = `data:image/webp;base64,${buffer.toString('base64')}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'affiliate-products',
      resource_type: 'image',
      unique_filename: true,
      overwrite: false,
    });
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err?.message || err);
    throw new AppError(
      `Cloudinary upload failed. Check API keys on Render. ${err?.message || ''}`.trim(),
      500
    );
  }
};

export const processAndStoreImage = async (file) => {
  if (!file) return null;

  const optimizedBuffer = await sharp(file.path)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  await fs.unlink(file.path).catch(() => {});

  if (isCloudinaryEnabled()) {
    return uploadToCloudinary(optimizedBuffer);
  }

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  const outputPath = path.join(uploadDir, filename);
  await fs.writeFile(outputPath, optimizedBuffer);

  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${filename}`;
};

export const validateImageUrl = (imageUrl) => {
  if (!imageUrl) return;

  if (process.env.NODE_ENV === 'production' && imageUrl.includes('localhost')) {
    throw new AppError(
      'Invalid image URL. Re-upload the image from the live admin panel so it saves to Cloudinary.',
      400
    );
  }

  if (isCloudinaryEnabled() && !imageUrl.includes('res.cloudinary.com') && !imageUrl.startsWith('http')) {
    throw new AppError('Invalid image URL format', 400);
  }
};

export const deleteLocalImage = async (imageUrl) => {
  if (!imageUrl || isCloudinaryEnabled()) return;
  try {
    const filename = path.basename(new URL(imageUrl).pathname);
    await fs.unlink(path.join(uploadDir, filename));
  } catch {
    /* ignore */
  }
};

export const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl?.includes('res.cloudinary.com')) return;
  try {
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return;
    const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
    await cloudinary.uploader.destroy(publicId);
  } catch {
    /* ignore */
  }
};
