import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
    id: number,
    nombre: string,
    email: string,
    password: string,
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
            type:DataTypes
        },
    },

)
