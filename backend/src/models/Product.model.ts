import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database'; 

// Interfaz para los atributos del producto
interface ProductAttributes {
  id: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  descuento?: number;
  stock: number;
  peso?: number;
  categoria_id?: number;
  imagen_principal?: string;
  meta_title?: string;
  meta_description?: string;
  activo?: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

// Atributos opcionales para la creación (id, fechas se generan automáticamente)
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'descuento' | 'stock' | 'peso' | 'categoria_id' | 'imagen_principal' | 'meta_title' | 'meta_description' | 'activo' | 'fecha_creacion' | 'fecha_actualizacion'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public sku!: string;
  public nombre!: string;
  public descripcion?: string;
  public precio!: number;
  public descuento?: number;
  public stock!: number;
  public peso?: number;
  public categoria_id?: number;
  public imagen_principal?: string;
  public meta_title?: string;
  public meta_description?: string;
  public activo?: boolean;
  public fecha_creacion?: Date;
  public fecha_actualizacion?: Date;
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
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    descuento: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    peso: {
      type: DataTypes.DECIMAL(6, 3),
      allowNull: true,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id',
      },
    },
    imagen_principal: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    meta_title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
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