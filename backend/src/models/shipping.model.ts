import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ShippingAttributes {
  id: number;
  pedido_id: number;
  proveedor: 'andreani' | 'correo_argentino';
  accion: string;
  request?: string;
  response?: string;
  estado: 'success' | 'error' | 'warning';
  mensaje?: string;
  fecha?: Date;
}

type ShippingCreationAttributes = Optional<ShippingAttributes, 'id' | 'fecha'>;

export class Shipping extends Model<ShippingAttributes, ShippingCreationAttributes> implements ShippingAttributes {
  id!: number;
  pedido_id!: number;
  proveedor!: 'andreani' | 'correo_argentino';
  accion!: string;
  request?: string;
  response?: string;
  estado!: 'success' | 'error' | 'warning';
  mensaje?: string;
  fecha?: Date;
}

Shipping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id',
      },
    },
    proveedor: {
      type: DataTypes.ENUM('andreani', 'correo_argentino'),
      allowNull: false,
    },
    accion: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    request: {
      type: DataTypes.TEXT,
    },
    response: {
      type: DataTypes.TEXT,
    },
    estado: {
      type: DataTypes.ENUM('success', 'error', 'warning'),
      defaultValue: 'success',
    },
    mensaje: {
      type: DataTypes.STRING(500),
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'shipping_logs',
    modelName: 'shipping',
    timestamps: false,
  }
);

export default Shipping; 