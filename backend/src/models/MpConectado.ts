import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface MpConectadoAttributes {
    id: number;
    usuario_id: number;
    mp_user_id: string;
    access_token: string;
    refresh_token: string;
    public_key: string;
    expires_at: Date;
    fecha_conexion?: Date;
    fecha_actualizacion?: Date;
}

type MpConectadoCreationAttributes = Optional<MpConectadoAttributes, 'id' | 'fecha_conexion' | 'fecha_actualizacion'>;

export class MpConectado extends Model<MpConectadoAttributes, MpConectadoCreationAttributes> implements MpConectadoAttributes {
    public id!: number;
    public usuario_id!: number;
    public mp_user_id!: string;
    public access_token!: string;
    public refresh_token!: string;
    public public_key!: string;
    public expires_at!: Date;
    
    // Timestamps
    public readonly fecha_conexion!: Date;
    public readonly fecha_actualizacion!: Date;
}

MpConectado.init(
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
            },
            onDelete: 'CASCADE'
        },
        mp_user_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: 'unique_mp_user'
        },
        access_token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        public_key: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'mp_conectados',
        modelName: 'mpConectado',
        timestamps: true,
        createdAt: 'fecha_conexion',
        updatedAt: 'fecha_actualizacion',
        indexes: [
            {
                unique: true,
                fields: ['mp_user_id'],
                name: 'unique_mp_user'
            }
        ]
    }
);