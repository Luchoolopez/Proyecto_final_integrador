import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Promotion extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion!: string | null;
  public tipo!: 'descuento_porcentaje' | 'descuento_fijo' | 'n_x_m';
  public valor_descuento!: number | null;
  public lleva_n!: number | null;
  public paga_m!: number | null;
  public fecha_inicio!: Date;
  public fecha_fin!: Date;
  public activa!: boolean;
  public acumulable_con_cupones!: boolean;
  public readonly fecha_creacion!: Date;
}

Promotion.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('descuento_porcentaje', 'descuento_fijo', 'n_x_m'),
    allowNull: false,
  },
  valor_descuento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  lleva_n: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  paga_m: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  acumulable_con_cupones: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, { 
  sequelize, 
  tableName: 'promociones', 
  timestamps: false 
});
