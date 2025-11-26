import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../validations/category.schema';
import { ZodError } from 'zod';

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    getCategories = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { active, genero, con_descuento } = req.query;

            const filters: any = {
                activo: active !== 'false'
            };

            if (con_descuento === 'true') {
                filters.con_descuento = true;
            }

            if (genero) {
                filters.genero = genero;
            }
            
            const categories = await this.categoryService.getCategories(filters);
            return res.status(200).json({
                success: true,
                data: categories,
                count: categories.length
            });
        } catch (error) {
            console.error('Error al obtener categorías', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener categorías'
            });
        }
    };

    getCategoryById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const categoryId = Number(id);
            if (isNaN(categoryId) || categoryId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de categoría inválido'
                });
            }
            const category = await this.categoryService.getCategorybyId(categoryId);
            return res.status(200).json({
                success: true,
                data: category,
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('no encontrada')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            console.error('Error al obtener categoría', error);
            return res.status(500).json({ success: false, message: 'Error al obtener la categoría' });
        }
    }

    createCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const parseData = createCategorySchema.parse(req.body);
            const newCategory = await this.categoryService.createCategory(parseData);
            return res.status(201).json({
                success: true,
                message: 'Categoría creada exitosamente',
                data: newCategory,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: error.issues,
                });
            }
            if (error instanceof Error && error.message.includes('ya existe')) {
                return res.status(409).json({ success: false, message: error.message }); // 409 Conflict
            }
            console.error('Error al crear la categoría', error);
            return res.status(500).json({
                success: false,
                message: 'Error al crear la categoría',
            });
        }
    }

    updateCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const categoryId = Number(id);
            if (isNaN(categoryId) || categoryId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de categoría inválido',
                });
            }
            const parseData = updateCategorySchema.parse(req.body);
            const updatedCategory = await this.categoryService.updateCategory(categoryId, parseData);
            return res.status(200).json({
                success: true,
                message: 'Categoría actualizada exitosamente',
                data: updatedCategory,
            });

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: error.issues,
                });
            }
            if (error instanceof Error && error.message.includes('no encontrada')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            if (error instanceof Error && error.message.includes('ya existe')) {
                return res.status(409).json({ success: false, message: error.message });
            }
            console.error('Error al actualizar la categoría', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar la categoría',
            });
        }
    }

    deleteCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            
            const { id } = req.params;
            const categoryId = Number(id);
            if (isNaN(categoryId) || categoryId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de categoría inválido',
                });
            }

            await this.categoryService.deleteCategory(categoryId);

            return res.status(200).json({
                success: true,
                message: 'Categoría eliminada exitosamente',
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('Categoria no encontrada')) {
                    // Error: Categoría no encontrada
                    return res.status(404).json({ success: false, message: error.message });
                }
                if (error.message.includes('No se puede eliminar la categoría porque tiene productos asociados')) {
                    // Error: Categoría tiene productos asociados (Conflicto)
                    return res.status(409).json({ success: false, message: error.message }); // 409 Conflict es apropiado aquí
                }
            }
            
            // Para cualquier otro error inesperado
            console.error('Error al eliminar la categoría', error);
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar la categoría',
            });
        }
    };
}