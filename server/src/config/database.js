import mongoose from 'mongoose';

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME || undefined
  });

  isConnected = true;
  console.log('Connected to MongoDB');

  return mongoose.connection;
}
