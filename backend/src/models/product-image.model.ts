import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductImageAttributes {
  id: number;
  producto_id: number;
  imagen: string;
  alt_text?: string;
  orden?: number;
  activo?: boolean;
  fecha_creacion?: Date;
  es_principal?: boolean;
}

export interface ProductImageCreationAttributes
  extends Optional<ProductImageAttributes, 'id' | 'alt_text' | 'orden' | 'activo' | 'fecha_creacion' | 'es_principal'> {}

export class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  public id!: number;
  public producto_id!: number;
  public imagen!: string;
  public alt_text?: string;
  public orden?: number;
  public activo!: boolean;
  public fecha_creacion!: Date;
  public es_principal!: boolean;
  // timestamps!
  public readonly createdAt!: Date; 
  public readonly updatedAt!: Date; 
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'producto_id',
      references: { model: 'productos', key: 'id' },
      onDelete: 'CASCADE',
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'URL de la imagen en Cloudinary',
    },
    alt_text: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Texto alternativo para SEO',
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Orden de aparición en galería',
    },
    es_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indica si esta imagen es la principal del producto',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'producto_imagenes',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);
