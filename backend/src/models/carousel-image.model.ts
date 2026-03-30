import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CarouselImageAttributes {
  id: number;
  imagen: string;
  alt_text?: string;
  orden?: number;
  activo?: boolean;
  fecha_creacion?: Date;
}

export interface CarouselImageCreationAttributes
  extends Optional<CarouselImageAttributes, 'id' | 'alt_text' | 'orden' | 'activo' | 'fecha_creacion'> {}

export class CarouselImage
  extends Model<CarouselImageAttributes, CarouselImageCreationAttributes>
  implements CarouselImageAttributes
{
  public id!: number;
  public imagen!: string;
  public alt_text?: string;
  public orden?: number;
  public activo!: boolean;
  public fecha_creacion!: Date;

  // timestamps automáticos de Sequelize
  public readonly createdAt!: Date; 
  public readonly updatedAt!: Date; 
}

CarouselImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'URL de la imagen del carrusel en Cloudinary',
    },
    alt_text: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Texto alternativo para SEO o descripción breve',
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Para definir qué foto va primero (0, 1, 2...)',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Permite ocultar una foto sin borrarla',
    },
  },
  {
    sequelize,
    modelName: 'CarouselImage',
    tableName: 'carousel_imagenes', // Nombre de la tabla en MySQL
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);