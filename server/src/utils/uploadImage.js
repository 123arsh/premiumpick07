import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { cloudinary } from '../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');

export const processAndStoreImage = async (file) => {
  if (!file) return null;

  const optimizedBuffer = await sharp(file.path)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  if (process.env.UPLOAD_PROVIDER === 'cloudinary') {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'affiliate-products', resource_type: 'image' },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(optimizedBuffer);
    });
    await fs.unlink(file.path).catch(() => {});
    return result.secure_url;
  }

  const filename = `${path.parse(file.filename).name}.webp`;
  const outputPath = path.join(uploadDir, filename);
  await fs.writeFile(outputPath, optimizedBuffer);
  await fs.unlink(file.path).catch(() => {});

  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${filename}`;
};

export const deleteLocalImage = async (imageUrl) => {
  if (!imageUrl || process.env.UPLOAD_PROVIDER === 'cloudinary') return;
  try {
    const filename = path.basename(new URL(imageUrl).pathname);
    await fs.unlink(path.join(uploadDir, filename));
  } catch {
    /* ignore */
  }
};
