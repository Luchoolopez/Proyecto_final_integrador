import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs-extra';

export const uploadController = {
    async uploadImage(req: Request, res: Response) {
        try {
            // 1. Verificar si Multer capturó un archivo
            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No se subió ninguna imagen' 
                });
            }

            // 2. Subir el archivo a Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'mi_ecommerce_productos' // Carpeta dentro de Cloudinary
            });

            // 3. Borrar el archivo de tu carpeta local 'uploads' (ya está en la nube, no lo necesitamos)
            await fs.unlink(req.file.path);

            // 4. Devolver la URL al usuario/frontend
            return res.json({
                success: true,
                message: 'Imagen subida correctamente',
                imageUrl: result.secure_url, // <--- ESTO ES LO QUE NECESITAS
                public_id: result.public_id
            });

        } catch (error) {
            // Si falla, intentamos borrar el archivo local si quedó ahí
            if (req.file && req.file.path) {
                await fs.unlink(req.file.path).catch(() => null);
            }
            console.error(error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al subir la imagen a Cloudinary',
                error 
            });
        }
    }
};