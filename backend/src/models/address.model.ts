import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AddressAttributes {
  id: number;
  usuario_id: number;
  calle: string;
  numero?: string | null;    
  piso?: string | null;      
  dpto?: string | null;     
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  pais?: string;            
  es_principal?: boolean;    
}

export interface AddressCreationAttributes
  extends Optional<
    AddressAttributes,
    'id' | 'numero' | 'piso' | 'dpto' | 'pais' | 'es_principal'
  > {}

export class Address extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes
{
  public id!: number;
  public usuario_id!: number;
  public calle!: string;
  public numero?: string | null;
  public piso?: string | null;
  public dpto?: string | null;
  public ciudad!: string;
  public provincia!: string;
  public codigo_postal!: string;
  public pais!: string;
  public es_principal!: boolean;


}

Address.init(
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
        key: 'id',
      },
    },
    calle: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    piso: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    dpto: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    codigo_postal: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING(100),
      defaultValue: 'Argentina',
    },
    es_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'direcciones',
    modelName: 'Address', 
    timestamps: false,    
  }
);

export default Address;