import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Coupon extends Model {
  public id!: number;
  public codigo!: string;
  public descripcion!: string | null;
  public tipo!: 'porcentaje' | 'monto_fijo';
  public valor!: number;
  public monto_minimo!: number;
  public usos_maximos!: number | null;
  public usos_actuales!: number;
  public limite_uso_por_usuario!: number;
  public fecha_inicio!: Date;
  public fecha_fin!: Date;
  public activo!: boolean;
  public readonly fecha_creacion!: Date;
}

Coupon.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  codigo: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('porcentaje', 'monto_fijo'),
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  monto_minimo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  usos_maximos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  usos_actuales: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  limite_uso_por_usuario: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, { 
  sequelize, 
  tableName: 'cupones', 
  timestamps: false 
});
