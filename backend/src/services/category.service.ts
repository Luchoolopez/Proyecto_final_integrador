import { Category } from "../models/category.model";
import { ServiceHelpers } from "../utils/user/user.helpers";
import { sequelize } from "../config/database";
import { Product } from "../models/product.model";
import { ForeignKeyConstraintError } from "sequelize/types";

interface CategoryData {
    nombre: string;
    descripcion?: string | null;
    activo?: boolean
}

export class CategoryService {

    async getCategories(onlyActive: boolean = true): Promise<Category[]> {
        try {
            const whereClause: { activo?: boolean } = {}
            if (onlyActive) {
                whereClause.activo = true;
            }
            const categories = await Category.findAll({ where: whereClause });
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
            // Aplicar actualizaciones - Asegúrate de sanitizar o validar qué campos se pueden actualizar
            const allowedUpdates: Partial<CategoryData> = {};
            if (updateData.nombre !== undefined) allowedUpdates.nombre = updateData.nombre;
            if (updateData.descripcion !== undefined) allowedUpdates.descripcion = updateData.descripcion;
            if (updateData.activo !== undefined) allowedUpdates.activo = updateData.activo;


            await category.update(allowedUpdates);
            return category; // Devuelve la categoría actualizada

        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'CategoryService.updateCategory')
        }


    }

    async deleteCategory(id: number): Promise<boolean> {
        // Iniciar una transacción para asegurar la consistencia
        const transaction = await sequelize.transaction();
        try {
            // 1. Buscar la categoría a eliminar (dentro de la transacción)
            const category = await Category.findByPk(id, { transaction });
            if (!category) {
                await transaction.rollback(); // Deshacer la transacción si no se encuentra
                throw new Error('Categoria no encontrada');
            }

            // 2. Verificar si existen productos asociados a esta categoría
            const productCount = await Product.count({
                where: { categoriaId: id },
                transaction // Realizar el conteo dentro de la misma transacción
            });

            // 3. Si hay productos asociados, lanzar un error y deshacer la transacción
            if (productCount > 0) {
                await transaction.rollback();
                // Puedes usar un mensaje más específico o un código de error si prefieres
                throw new Error(`${'No se puede eliminar la categoría porque tiene productos asociados'} (ID: ${id}, Productos: ${productCount})`);
            }

            // 4. Si no hay productos asociados, proceder con el borrado físico
            await category.destroy({ transaction }); // Borrar dentro de la transacción
            console.log(`Categoría ${id} eliminada permanentemente (hard delete).`);

            // 5. Si todo salió bien, confirmar la transacción
            await transaction.commit();
            return true; // Indica que se borró exitosamente

        } catch (error) {
            // 6. Si ocurre cualquier error, deshacer la transacción
            await transaction.rollback();

            // Re-lanzar el error para que sea manejado por el controlador
            // Puedes mantener el manejo genérico o añadir lógica específica si es necesario
            if (error instanceof Error && (error.message.includes('Categoria no encontrada') || error.message.includes('No se puede eliminar la categoría porque tiene productos asociados'))) {
                // Si es un error que ya lanzamos nosotros (Not Found o Has Products), lo relanzamos tal cual
                throw error;
            } else {
                // Para otros errores inesperados, usamos el helper
                throw ServiceHelpers.handleServiceError(error, 'CategoryService.deleteCategory (hard)');
            }
        }
    }
}
            
        



