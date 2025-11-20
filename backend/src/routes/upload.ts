import { Router } from "express";
import upload from "../middlewares/upload.middleware"; // El del paso 2
import { uploadController } from "../controllers/upload.controller"; // El del paso 3
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// POST http://localhost:3000/api/upload
// Usamos 'image' como la clave (key) que espera Multer
router.post('/', 
    AuthMiddleware.authenticate, // Opcional: si quieres que solo usuarios logueados suban fotos
    upload.single('image'), 
    uploadController.uploadImage
);

export { router };