import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { ProductVariant } from "./product-variant.model";

interface CartAttributes {
    id: number;
    usuario_id: number;
    variante_id: number;
    cantidad?: number;
    fecha_agregado?: Date;
    fecha_actualizacion?: Date;
}

type CartCreationAttributes = Optional<CartAttributes, 'id' | 'cantidad' | 'fecha_agregado' | 'fecha_actualizacion'>;

export class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: number;
    public usuario_id!: number;
    public variante_id!: number
    public cantidad!: number;
    public readonly fecha_agregado!: Date;
    public readonly fecha_actualizacion!: Date;
}

Cart.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        variante_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'variantes_producto',
                key: 'id'
            }
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        },
    },
    {
        sequelize,
        tableName: 'carritos',
        modelName: 'cart',
        timestamps: true,
        createdAt: 'fecha_agregado',
        updatedAt: 'fecha_actualizacion',
        indexes: [
            {
                unique: true,
                fields: ['usuario_id', 'variante_id'],
                name: 'unique_user_variant'
            }
        ]
    }
)

Cart.belongsTo(ProductVariant, {
    foreignKey: 'variante_id',
    as: 'variante'
});

