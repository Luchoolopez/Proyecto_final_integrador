import { Product } from "../models/Product.model";
import { Op } from "sequelize";

export const getAllProducts = async(): Promise<Product[]> => {
    return await Product.findAll();
};

export const getProductById = async(id: number): Promise<Product | null> => {
    return await Product.findByPk(id);
};

export const getProductsByCategory = async(categoryId: number): Promise<Product[]> => {
    return await Product.findAll({
        where: {
            categoria_id: categoryId
        }
    });
};

export const getNewProducts = async(): Promise<Product[]> => {
    return await Product.findAll({
        order: [['fecha_creacion', 'DESC']]
    });
};

export const getProductsByDiscount = async(): Promise<Product[]> => {
    return await Product.findAll({
        where: {
            descuento: {
                [Op.gt]: 0
            }
        },
        order: [['descuento', 'DESC']]
    });
};

// Se puede cambiar el limite para mostrar mas o menos products
export const getRelatedProducts = async(id: number, categoryId: number): Promise<Product[]> => {
    return await Product.findAll({
        where: {
            categoria_id: categoryId,
            id: {
                [Op.ne]: id
            }
        },
        limit: 10
    });
};

export const searchProducts = async(query: string): Promise<Product[]> => {
    return await Product.findAll({
        where: {
            [Op.or]: [
                {
                    nombre: {
                        [Op.like]: `%${query}%`
                    }
                },
                {
                    descripcion: {
                        [Op.like]: `%${query}%`
                    }
                }
            ]
        }
    });
};

// Falta imagenes pero no hicimos el cloudinary todavia