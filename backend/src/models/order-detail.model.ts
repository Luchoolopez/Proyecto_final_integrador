import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface OrderDetailAttributes {
  id: number;
  pedido_id: number;
  variante_id: number;
  sku_variante?: string;
  nombre_producto: string;
  talle: string;
  cantidad: number;
  precio_unitario: number;
  descuento_aplicado: number;
}

type OrderDetailCreationAttributes = Optional<OrderDetailAttributes, 'id'>;

export class OrderDetail extends Model<OrderDetailAttributes, OrderDetailCreationAttributes> implements OrderDetailAttributes {
  id!: number;
  pedido_id!: number;
  variante_id!: number;
  sku_variante?: string;
  nombre_producto!: string;
  talle!: string;
  cantidad!: number;
  precio_unitario!: number;
  descuento_aplicado!: number;
}

OrderDetail.init(
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
    variante_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'variantes_producto',
        key: 'id',
      },
    },
    sku_variante: {
      type: DataTypes.STRING(100),
    },
    nombre_producto: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    talle: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    descuento_aplicado: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'detalles_pedido',
    modelName: 'orderDetail',
    timestamps: false,
  }
);

export default OrderDetail;