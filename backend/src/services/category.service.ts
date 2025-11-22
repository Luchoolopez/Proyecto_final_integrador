import { Category } from "../models/category.model";
import { ServiceHelpers } from "../utils/user/user.helpers";
import { sequelize } from "../config/database";
import { Product } from "../models/product.model";
import { Op } from "sequelize";

interface CategoryData {
    nombre: string;
    descripcion?: string | null;
    activo?: boolean
}

interface CategoryFilters {
    activo?: boolean;
    genero?: 'Hombre' | 'Mujer' | 'Unisex' | string | string[];
    con_descuento?: boolean;
}

export class CategoryService {

    async getCategories(filters: CategoryFilters = { activo: true }): Promise<Category[]> {
        try {
            const whereClause: any = {};
            if (filters.activo) {
                whereClause.activo = true;
            }

            const includeOptions: any = [];

            if (filters.genero || filters.con_descuento) {
                const productWhere: any = { activo: true };

                if (filters.genero) {
                    if (Array.isArray(filters.genero)) {
                        productWhere.genero = { [Op.in]: filters.genero };
                    } else {
                        productWhere.genero = filters.genero;
                    }
                }

                if (filters.con_descuento) {
                    productWhere.descuento = { [Op.gt]: 0 };
                }
                
                includeOptions.push({
                    model: Product,
                    as: 'productos', 
                    where: productWhere,
                    required: true, 
                    attributes: []
                });
            }

            const categories = await Category.findAll({
                where: whereClause,
                include: includeOptions,
                group: [
                    'category.id', 
                    'category.nombre', 
                    'category.descripcion', 
                    'category.activo', 
                    'category.fecha_creacion'
                ],
                order: [['nombre', 'ASC']]
            });
            return categories;
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'CategoryService.getCategories');
        }
    }

    async getCategorybyId(id: number): Promise<Category | null> {
        try {
            if (!id || isNaN(id)) {
                throw new Error('El ID de la categoría es inválido');
            }
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error("Categoria no encontrada")
            }
            return category;
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'CategoryService.getCategoryById')
        }
    }

    async createCategory(data: CategoryData): Promise<Category> {
        try {
            const existing = await Category.findOne({ where: { nombre: data.nombre } })
            if (existing) {
                throw new Error('La categoria ya existe')
            }
            const newCateogry = await Category.create({
                nombre: data.nombre,
                descripcion: data.descripcion || null,
                activo: data.activo !== undefined ? data.activo : true,
            });
            return newCateogry;
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'CategoryService.createCategory')
        }
    }

    async updateCategory(id: number, updateData: Partial<CategoryData>): Promise<Category> {
        try {
            const category = await this.getCategorybyId(id);
            if (!category) {
                throw new Error('Categoria no encontrada dentro de updatecategory')
            }
            if (updateData.nombre && updateData.nombre !== category.nombre) {
                const existingCategory = await Category.findOne({ where: { nombre: updateData.nombre } });
                if (existingCategory) {
                    throw new Error('La categoría con ese nombre ya existe');
                }
            }
            const allowedUpdates: Partial<CategoryData> = {};
            if (updateData.nombre !== undefined) allowedUpdates.nombre = updateData.nombre;
            if (updateData.descripcion !== undefined) allowedUpdates.descripcion = updateData.descripcion;
            if (updateData.activo !== undefined) allowedUpdates.activo = updateData.activo;

            await category.update(allowedUpdates);
            return category;

        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'CategoryService.updateCategory')
        }
    }

    async deleteCategory(id: number): Promise<boolean> {
        const transaction = await sequelize.transaction();
        try {
            const category = await Category.findByPk(id, { transaction });
            if (!category) {
                throw new Error('Categoria no encontrada');
            }

            const productCount = await Product.count({
                where: { categoriaId: id },
                transaction
            });

            if (productCount > 0) {
                throw new Error(`No se puede eliminar la categoría porque tiene productos asociados (ID: ${id}, Productos: ${productCount})`);
            }

            await category.destroy({ transaction });
            console.log(`Categoría ${id} eliminada permanentemente (hard delete).`);

            await transaction.commit();
            return true;

        } catch (error) {
            try {
                await transaction.rollback();
            } catch (e) {
                console.error("Error al hacer rollback:", e);
            }

            if (error instanceof Error && (error.message.includes('Categoria no encontrada') || error.message.includes('No se puede eliminar la categoría porque tiene productos asociados'))) {
                throw error;
            } else {
                throw ServiceHelpers.handleServiceError(error, 'CategoryService.deleteCategory (hard)');
            }
        }
    }
}