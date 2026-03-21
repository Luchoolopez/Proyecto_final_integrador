import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Promotion extends Model {
    public id!: number;
    public nombre!: string;
    public descripcion?: string;
    public tipo!: 'porcentaje' | 'monto_fijo' | 'nxm';
    public valor?: number;
    public lleva_n?: number;
    public paga_m?: number;
    public fecha_inicio!: Date;
    public fecha_fin!: Date;
    public activa!: boolean;
    public acumulable!: boolean;
    
    // Tipado para las relaciones
    public categorias?: any[];
    public productos?: any[];
}

Promotion.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    tipo: { type: DataTypes.ENUM('porcentaje', 'monto_fijo', 'nxm'), allowNull: false },
    valor: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    lleva_n: { type: DataTypes.INTEGER, allowNull: true },
    paga_m: { type: DataTypes.INTEGER, allowNull: true },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false },
    fecha_fin: { type: DataTypes.DATE, allowNull: false },
    activa: { type: DataTypes.BOOLEAN, defaultValue: true },
    acumulable: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
    sequelize, 
    tableName: 'promociones', 
    timestamps: false 
});
