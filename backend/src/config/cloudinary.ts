import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

export const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_API_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Faltan las variables de entorno de Cloudinary');
    console.error('Las variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET son necesarias.');
    process.exit(1); // Detiene la aplicación si las variables no están configuradas
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true, // Para que siempre genere URLs https
  });

  console.log('Cloudinary configurado!');
};
