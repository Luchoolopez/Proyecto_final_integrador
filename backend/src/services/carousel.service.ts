import { CarouselImage } from '../models/carousel-image.model';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs-extra';

export const CarouselService = {
    // Para el frontend público (solo fotos activas ordenadas)
    async getActiveImages() {
        return await CarouselImage.findAll({
            where: { activo: true },
            order: [['orden', 'ASC']],
        });
    },

    // Para el panel de admin (todas las fotos)
    async getAllImages() {
        return await CarouselImage.findAll({
            order: [['orden', 'ASC']],
        });
    },

    // Subir nueva foto
    async uploadImage(filePath: string, altText?: string, orden?: number) {
        try {
            // Subimos a Cloudinary forzando el formato y la optimización
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'concepthab/carousel',
                // Como el encuadre lo hará el admin en el frontend, 
                // acá solo le pedimos a Cloudinary que optimice el peso
                format: 'webp',
                quality: 'auto'
            });

            // Borramos el archivo temporal de la carpeta uploads/
            await fs.unlink(filePath);

            // Guardamos en la base de datos
            const newImage = await CarouselImage.create({
                imagen: result.secure_url,
                alt_text: altText || 'Imagen del carrusel',
                orden: orden || 0,
                activo: true
            });

            return newImage;
        } catch (error) {
            // Si falla algo, intentamos borrar el archivo temporal por las dudas
            if (await fs.pathExists(filePath)) await fs.unlink(filePath);
            throw new Error('Error al subir la imagen del carrusel');
        }
    },

    // Eliminar foto
    async deleteImage(id: number) {
        const image = await CarouselImage.findByPk(id);
        if (!image) throw new Error('Imagen no encontrada');

        // Extraer el public_id de Cloudinary para borrarla de ahí también
        // Ejemplo de URL: https://res.cloudinary.com/.../concepthab/carousel/mi_foto.webp
        const urlParts = image.imagen.split('/');
        const lastPart = urlParts[urlParts.length - 1] || '';
        const fileName = lastPart.split('.')[0];
        const publicId = `concepthab/carousel/${fileName}`;

        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('No se pudo borrar la imagen de Cloudinary, pero se borrará de la DB:', error);
        }

        await image.destroy();
        return { success: true, message: 'Imagen eliminada correctamente' };
    }
};