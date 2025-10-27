import { Product } from './product.model';
import { ProductVariant } from './product-variant.model';
import { ProductImage } from './product-image.model';
import { Category } from './category.model';

/**
 * Define las relaciones entre todos los modelos
 * Debe ejecutarse DESPUÉS de que todos los modelos estén inicializados
 */
export function setupAssociations() {
  // =====================================
  // RELACIÓN: Product <-> ProductVariant
  // =====================================
  Product.hasMany(ProductVariant, {
    foreignKey: 'producto_id',
    as: 'variantes',
    onDelete: 'CASCADE',
  });

  ProductVariant.belongsTo(Product, {
    foreignKey: 'producto_id',
    as: 'producto',
  });

  // =====================================
  // RELACIÓN: Product <-> Category
  // =====================================
  Product.belongsTo(Category, {
    foreignKey: 'categoria_id',
    as: 'categoria',
  });

  Category.hasMany(Product, {
    foreignKey: 'categoria_id',
    as: 'productos',
  });

  // =====================================
  // RELACIÓN: Product <-> ProductImage
  // =====================================
  Product.hasMany(ProductImage, {
    foreignKey: 'producto_id',
    as: 'imagenes',
    onDelete: 'CASCADE',
  });

  ProductImage.belongsTo(Product, {
    foreignKey: 'producto_id',
    as: 'producto',
  });

  console.log('✅ Asociaciones de modelos configuradas correctamente');
}

/**
 * Helpers para incluir asociaciones en queries
 */
export const includeVariants = {
  model: ProductVariant,
  as: 'variantes',
  where: { activo: true },
  required: false,
};

export const includeAllVariants = {
  model: ProductVariant,
  as: 'variantes',
  required: false,
};

export const includeImages = {
  model: ProductImage,
  as: 'imagenes',
  where: { activo: true },
  required: false,
};

export const includeCategory = {
  model: Category,
  as: 'categoria',
  required: false,
};
