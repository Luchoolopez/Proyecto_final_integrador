import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductVariantAttributes {
  id: number;
  productoId: number;
  talle: string;
  sku_variante?: string;
  stock: number;
  activo?: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface ProductVariantCreationAttributes
  extends Optional<
    ProductVariantAttributes,
    'id' | 'sku_variante' | 'stock' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'
  > {}

export class ProductVariant extends Model<ProductVariantAttributes, ProductVariantCreationAttributes>
  implements ProductVariantAttributes
{
  public id!: number;
  public productoId!: number;
  public talle!: string;
  public sku_variante?: string;
  public stock!: number;
  public activo?: boolean;
  public fecha_creacion?: Date;
  public fecha_actualizacion?: Date;

  public isAvailable(): boolean {
    return this.activo === true && this.stock > 0;
  }
}

ProductVariant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'producto_id',
      references: { model: 'productos', key: 'id' },
      onDelete: 'CASCADE',
    },
    talle: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'Talle: XS, S, M, L, XL, XXL, 36, 38, 40, etc.',
    },
    sku_variante: {
      type: DataTypes.STRING(100),
      unique: true,
      comment: 'SKU único de la variante (ej: REM-OVR-NEGRO-M)',
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'ProductVariant',
    tableName: 'variantes_producto',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);
