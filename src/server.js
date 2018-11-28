import mongoose from 'mongoose';
import { MONGO_URI, PORT } from './config';
import app from './app';

const bootstrapServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT);
    console.log(`Server started on port: ${PORT}`);
  } catch (error) {
    throw new Error('Mongo Connection failed');
  }
};

bootstrapServer();
