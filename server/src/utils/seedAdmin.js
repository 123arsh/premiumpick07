import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;

  if (!uri || !password) {
    console.error('Set MONGODB_URI and ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin "${username}" already exists. Skipping seed.`);
  } else {
    await Admin.create({ username, password });
    console.log(`Admin "${username}" created successfully.`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
