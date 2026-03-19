import { Product } from './product.model';
import { ProductVariant } from './product-variant.model';
import { ProductImage } from './product-image.model';
import { Category } from './category.model';
import { User } from './user.model';
import { Order } from './order.model';
import { OrderDetail } from './order-detail.model'; 
import { Address } from './address.model';
import { Cart } from './cart.model'; 
import { Coupon } from './coupon.model';
import { Promotion } from './promotion.model';
import { UsedCoupon } from './used-coupon.model';

/**
 * Define las relaciones entre todos los modelos
 */
export function setupAssociations() {

  // =====================================
  // RELACIÓN: User <-> Order
  // =====================================
  User.hasMany(Order, { foreignKey: 'usuario_id', as: 'pedidos' });
  Order.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

  // =====================================
  // RELACIÓN: Order <-> OrderDetail
  // =====================================
  // CORRECCIÓN IMPORTANTE: El alias debe ser 'detalles' para coincidir con el Service
  Order.hasMany(OrderDetail, { foreignKey: 'pedido_id', as: 'detalles', onDelete: 'CASCADE' });
  OrderDetail.belongsTo(Order, { foreignKey: 'pedido_id', as: 'pedido' });

  // CORRECCIÓN: Falta la relación con variante para saber qué se compró
  OrderDetail.belongsTo(ProductVariant, { foreignKey: 'variante_id', as: 'variante' });

  // =====================================
  // RELACIÓN: User <-> Address
  // =====================================
  User.hasMany(Address, { foreignKey: 'usuario_id', as: 'direcciones' }); // Preferible minúscula
  Address.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

  // =====================================
  // RELACIÓN: Order -> Address
  // =====================================
  // Usamos 'direccion' para acceder facilmente: order.direccion.calle
  Order.belongsTo(Address, { foreignKey: 'direccion_id', as: 'direccion' });
  
  // =====================================
  // RELACIÓN: User <-> Cart (FALTABA ESTO)
  // =====================================
  User.hasMany(Cart, { foreignKey: 'usuario_id', as: 'carrito' });
  Cart.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
  
  Cart.belongsTo(ProductVariant, { foreignKey: 'variante_id', as: 'variante' });

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

  // =====================================
  // RELACIÓN: User <-> UsedCoupon
  // =====================================
  User.hasMany(UsedCoupon, { foreignKey: 'usuario_id', as: 'cupones_usados' });
  UsedCoupon.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

  // =====================================
  // RELACIÓN: Coupon <-> UsedCoupon
  // =====================================
  Coupon.hasMany(UsedCoupon, { foreignKey: 'cupon_id', as: 'usos' });
  UsedCoupon.belongsTo(Coupon, { foreignKey: 'cupon_id', as: 'cupon' });

  // =====================================
  // RELACIÓN: Order <-> UsedCoupon
  // =====================================
  Order.hasOne(UsedCoupon, { foreignKey: 'pedido_id', as: 'cupon_usado' });
  UsedCoupon.belongsTo(Order, { foreignKey: 'pedido_id', as: 'pedido' });

  // =====================================
  // RELACIÓN: Promotion <-> Category
  // =====================================
  Promotion.belongsToMany(Category, { 
    through: 'promocion_categorias', 
    foreignKey: 'promocion_id', 
    otherKey: 'categoria_id',
    as: 'categorias',
    timestamps: false
  });
  Category.belongsToMany(Promotion, { 
    through: 'promocion_categorias', 
    foreignKey: 'categoria_id', 
    otherKey: 'promocion_id',
    as: 'promociones',
    timestamps: false
  });

  // =====================================
  // RELACIÓN: Promotion <-> Product
  // =====================================
  Promotion.belongsToMany(Product, { 
    through: 'promocion_productos', 
    foreignKey: 'promocion_id', 
    otherKey: 'producto_id',
    as: 'productos',
    timestamps: false
  });
  Product.belongsToMany(Promotion, { 
    through: 'promocion_productos', 
    foreignKey: 'producto_id', 
    otherKey: 'promocion_id',
    as: 'promociones',
    timestamps: false
  });

  console.log('✅ Asociaciones de modelos configuradas correctamente');
}

// ... tus helpers de export const include... siguen igual abajo
export const includeVariants = {
  model: ProductVariant,
  as: 'variantes',
  attributes: ['id', 'talle', 'stock', 'sku_variante', 'activo'],
  required: false,
};

export const includeAllVariants = {
  model: ProductVariant,
  as: 'variantes',
  attributes: ['id', 'talle', 'stock', 'sku_variante', 'activo'],
  required: false,
};

export const includeImages = {
  model: ProductImage,
  as: 'imagenes',
  attributes: ['id', 'producto_id', 'imagen', 'alt_text', 'orden', 'activo'],
  where: { activo: true },
  required: false,
};

export const includeCategory = {
  model: Category,
  as: 'categoria',
  required: false,
};