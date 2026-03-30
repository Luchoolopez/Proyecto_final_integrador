import { Request, Response } from 'express';
import { CarouselService } from '../services/carousel.service';

export const CarouselController = {
    // Público
    async getActive(req: Request, res: Response) {
        try {
            const images = await CarouselService.getActiveImages();
            res.json(images);
        } catch (error: any) {
            res.status(500).json({ error: 'Error al obtener las imágenes' });
        }
    },

    // Admin
    async getAllAdmin(req: Request, res: Response) {
        try {
            const images = await CarouselService.getAllImages();
            res.json(images);
        } catch (error: any) {
            res.status(500).json({ error: 'Error al obtener las imágenes' });
        }
    },

    async upload(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No se envió ninguna imagen' });
            }

            const { alt_text, orden } = req.body;
            
            const newImage = await CarouselService.uploadImage(
                req.file.path, 
                alt_text, 
                orden ? Number(orden) : 0
            );

            res.status(201).json(newImage);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await CarouselService.deleteImage(id);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
};