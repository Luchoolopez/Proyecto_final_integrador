import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
    id: number,
    nombre: string,
    email: string,
    password: string,
    rol:'usuario' | 'admin',
    telefono?: string | null,
    activo: boolean,
    fecha_ultimo_acceso?: Date | null,
    fecha_creacion?: Date;
}

type UserCreationAttributes = Omit<UserAttributes, 'id' | 'fecha_ultimo_acceso' | 'fecha_creacion'>

export class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public nombre!: string;
    public email!: string;
    public password!: string;
    public rol!: 'usuario' | 'admin';
    public telefono!: string | null;
    public activo!: boolean;
    public fecha_ultimo_acceso!: Date | null;
    public fecha_creacion!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        email: {
            type:DataTypes.STRING(100),
            allowNull:false,
            unique:true
        },
        password:{
            type: DataTypes.STRING(255),
            allowNull:false,
        },
        rol: {
            type: DataTypes.ENUM('usuario', 'admin'),
            allowNull:false,
        },
        telefono:{
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        fecha_ultimo_acceso:{
            type:DataTypes.DATE,
            allowNull:true,
        },
        fecha_creacion:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue: DataTypes.NOW
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        modelName: 'user',
        timestamps: true, //esto maneja automaticamente el createdAt y updatedAt
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    }
);
