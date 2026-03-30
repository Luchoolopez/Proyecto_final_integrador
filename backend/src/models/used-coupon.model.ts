import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class UsedCoupon extends Model {
  public id!: number;
  public cupon_id!: number;
  public pedido_id!: number;
  public usuario_id!: number;
  public descuento_aplicado!: number;
  public readonly fecha_uso!: Date;
}

UsedCoupon.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cupon_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descuento_aplicado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha_uso: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, { 
  sequelize, 
  tableName: 'cupones_usados', 
  timestamps: false 
});
