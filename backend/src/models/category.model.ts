import {DataTypes, Model, Optional} from 'sequelize';
import {sequelize} from '../config/database';

interface CategoryAttributes {
    id: number;
    nombre:string;
    descripcion?:string | null;
    activo: boolean;
    fecha_creacion?: Date;
}
type CategoryCreationAttributes = Optional<CategoryAttributes, 'id' | 'descripcion' | 'activo' | 'fecha_creacion'>;

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: number;
    public nombre!: string;
    public descripcion!: string | null;
    public activo!: boolean;
    public fecha_creacion!: Date;

    // timestamps!
    public readonly createdAt!: Date; 
    public readonly updatedAt!: Date; 
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },

        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

    },

    {
        sequelize,
        tableName: 'categorias',
        modelName: 'category',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: false,
    }

    //Category.hasMany(Product, {
    //foreignKey: 'categoria_id', // La clave foránea en la tabla 'productos'
    //as: 'products' // Un alias opcional para usar al incluir (eager loading)

);