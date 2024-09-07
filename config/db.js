import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB conectado');
    } catch (error) {
      console.error('Error conectando a MongoDB', error);
      throw error; // Lanza el error para que el controlador lo maneje
    }
  }
};

export default connectDB;
