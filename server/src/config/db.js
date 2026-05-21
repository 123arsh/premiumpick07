import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in Render Environment variables');
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    throw new Error(
      'Cannot reach MongoDB. Check MONGODB_URI, Atlas credentials, and Network Access (allow 0.0.0.0/0).'
    );
  }
};
