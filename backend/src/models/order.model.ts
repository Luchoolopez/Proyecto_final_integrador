import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

interface OrderAttributes {
    id: number;
    numero_pedido?: string;
    usuario_id: number;
    direccion_id: number;
    total: number;
    estado: 'pendiente' | 'confirmado' | 'armando' | 'enviado' | 'entregado' | 'cancelado';
    notas?: string;
    fecha?: Date;
    fecha_envio?: Date;
    fecha_entrega?: Date;
    shipping_provider?: string;
    shipping_service?: string;
    tracking_number?: string;
    shipping_cost: number;
}

type OrderCreationAttributes = Optional<OrderAttributes, 'id' | 'numero_pedido' | 'fecha' | 'fecha_envio' | 'fecha_entrega'>;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    id!: number;
    numero_pedido!: string;
    usuario_id!: number;
    direccion_id!: number;
    total!: number;
    estado!: 'pendiente' | 'confirmado' | 'armando' | 'enviado' | 'entregado' | 'cancelado';
    notas?: string;
    fecha?: Date;
    fecha_envio?: Date;
    fecha_entrega?: Date;
    shipping_provider?: string;
    shipping_service?: string;
    tracking_number?: string;
    shipping_cost!: number;
}

Order.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        numero_pedido:{
            type:DataTypes.STRING(20),
            unique:true,
            allowNull:true,
        },
        usuario_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'usuarios',
                key:'id',
            },
        },
        direccion_id:{
            type:DataTypes.INTEGER,
            references:{
                model: 'direcciones',
                key: 'id',
            },
        },
        total:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false,
            validate:{
                min: 0,
           },
        },
        estado:{
            type:DataTypes.ENUM('pendiente', 'confirmado', 'armando', 'enviado', 'entregado', 'cancelado'),
            defaultValue: 'pendiente',
        },
        notas:{
            type:DataTypes.TEXT,
        },
        fecha:{
            type:DataTypes.DATE,
            defaultValue:DataTypes.NOW,
        },
        fecha_envio:{
            type:DataTypes.DATE,
        },
        fecha_entrega:{
            type:DataTypes.DATE,
        },
        shipping_provider:{
            type:DataTypes.STRING,
        },
        shipping_service:{
            type:DataTypes.STRING,
        },
        tracking_number:{
            type:DataTypes.STRING(100),
        },
        shipping_cost:{
            type:DataTypes.DECIMAL(10,2),
            defaultValue:0
        },
    },
    {
        sequelize,
        tableName: 'pedidos',
        modelName: 'order',
        timestamps: true,
        createdAt: 'fecha',
        updatedAt: false
    }
);

export default Order;
