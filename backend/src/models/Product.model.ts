import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductAttributes {
  id: number;
  sku?: string;
  nombre: string;
  genero?: 'Hombre' | 'Mujer' | 'Unisex';
  descripcion?: string;
  precio_base: number;
  descuento?: number;
  peso?: number;
  categoriaId?: number;
  imagen_principal?: string;
  es_nuevo?: boolean;
  es_destacado?: boolean;
  meta_title?: string;
  meta_description?: string;
  activo?: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    | 'id'| 'sku'| 'genero'| 'descripcion'| 'descuento'| 'peso'| 'categoriaId'
    | 'imagen_principal'| 'es_nuevo'| 'es_destacado'| 'meta_title'
    | 'meta_description'| 'activo' | 'fecha_creacion'| 'fecha_actualizacion'
  > {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public sku?: string;
  public nombre!: string;
  public genero?: 'Hombre' | 'Mujer' | 'Unisex';
  public descripcion?: string;
  public precio_base!: number;
  public descuento?: number;
  public peso?: number;
  public categoriaId?: number;
  public imagen_principal?: string;
  public es_nuevo?: boolean;
  public es_destacado?: boolean;
  public meta_title?: string;
  public meta_description?: string;
  public activo?: boolean;
  public fecha_creacion?: Date;
  public fecha_actualizacion?: Date;

  public getPrecioFinal(): number {
    const descuento = this.descuento || 0;
    return Math.round(this.precio_base * (1 - descuento / 100) * 100) / 100;
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sku: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    genero: {
      type: DataTypes.ENUM('Hombre', 'Mujer', 'Unisex'),
      defaultValue: 'Unisex',
    },
    descripcion: DataTypes.TEXT,
    precio_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    descuento: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    peso: DataTypes.DECIMAL(6, 3),
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categorias', key: 'id' },
      field: 'categoria_id', 
    },
    imagen_principal: DataTypes.STRING(255),
    es_nuevo: { type: DataTypes.BOOLEAN, defaultValue: false },
    es_destacado: { type: DataTypes.BOOLEAN, defaultValue: false },
    meta_title: DataTypes.STRING(200),
    meta_description: DataTypes.STRING(300),
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'productos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);
