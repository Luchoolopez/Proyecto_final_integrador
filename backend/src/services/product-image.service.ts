import { ProductImage } from '../models';

interface ImageData {
  producto_id: number;
  imagen: string; // URL de Cloudinary
  orden?: number;
  es_principal?: boolean;
}

class ProductImageService {
  /**
   * Obtener todas las imágenes de un producto
   */
  async getImagesByProduct(producto_id: number) {
    const imagenes = await ProductImage.findAll({
      where: { producto_id },
      order: [['orden', 'ASC']],
    });
    return imagenes;
  }

  /**
   * Agregar una nueva imagen
   */
  async addImage(data: ImageData) {
    const { producto_id, imagen } = data;
    if (!producto_id || !imagen) {
      throw new Error('producto_id e imagen son obligatorios');
    }

    // Si es principal, desactiva otras principales del mismo producto
    if (data.es_principal) {
      await ProductImage.update(
        { es_principal: false },
        { where: { producto_id } }
      );
    }

    const nuevaImagen = await ProductImage.create({
      producto_id,
      imagen,
      orden: data.orden ?? 0,
      es_principal: data.es_principal ?? false,
    });

    return nuevaImagen;
  }

  /**
   * Actualizar una imagen (marcarla como principal o cambiar orden)
   */
  async updateImage(id: number, data: Partial<ImageData>) {
    const imagen = await ProductImage.findByPk(id);
    if (!imagen) throw new Error('Imagen no encontrada');

    if (data.es_principal) {
      // Si esta imagen pasa a ser principal, desmarcar otras
      await ProductImage.update(
        { es_principal: false },
        { where: { producto_id: imagen.producto_id } }
      );
    }

    await imagen.update(data);
    return imagen;
  }

  /**
   * Eliminar imagen
   */
  async deleteImage(id: number) {
    const imagen = await ProductImage.findByPk(id);
    if (!imagen) throw new Error('Imagen no encontrada');

    await imagen.destroy(); // eliminamos físicamente
    return { message: 'Imagen eliminada correctamente' };
  }
}

export const productImageService = new ProductImageService();
export default productImageService;
