import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';

dotenv.config();

const update = async () => {
  const uri = process.env.MONGODB_URI;
  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!uri || !password) {
    console.error('Set MONGODB_URI and ADMIN_PASSWORD in server/.env');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const admin = await Admin.findOne({ username }).select('+password');
  if (!admin) {
    console.error(`Admin "${username}" not found. Run: npm run seed:admin`);
    process.exit(1);
  }

  admin.password = password;
  await admin.save();

  console.log(`Password updated for admin "${username}".`);
  await mongoose.disconnect();
  process.exit(0);
};

update().catch((err) => {
  console.error(err);
  process.exit(1);
});
