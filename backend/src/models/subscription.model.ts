import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SubscriptionAttributes {
    id: number,
    email: string,
    activo: boolean,
    fecha_suscripcion: Date,
    fecha_baja: Date | null,
}

interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id' | 'fecha_suscripcion' | 'fecha_baja'>{}

export class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
    implements SubscriptionAttributes {
    public id!: number;
    public email!: string;
    public activo!: boolean;
    public fecha_suscripcion!: Date;
    public fecha_baja!: Date | null;
}

Subscription.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    fecha_suscripcion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'fecha_suscripcion',
    },
    fecha_baja: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'fecha_baja'
    },
},
    {
        sequelize,
        tableName: 'suscripciones',
        timestamps: false,
    }
)

export default Subscription;
