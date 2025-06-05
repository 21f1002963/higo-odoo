import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/higo';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const NODE_ENV = process.env.NODE_ENV || 'development'; 