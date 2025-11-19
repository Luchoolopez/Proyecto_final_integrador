import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

interface OrderAttributes {
    id: number;
    numero_pedido: string;
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
    shipping_cost: number;
}

