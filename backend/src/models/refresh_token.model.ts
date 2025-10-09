import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RefreshTokenAttrs {
  id: number;
  usuario_id: number;
  jti: string;
  hash_token: string;
  expira_en: Date;
  revocado_en: Date | null;
  ip?: string | null;
  agente_usuario?: string | null;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

type RefreshTokenCreation = Optional<
  RefreshTokenAttrs,
  'id' | 'revocado_en' | 'ip' | 'agente_usuario' | 'fecha_creacion' | 'fecha_actualizacion'
>;

export class RefreshToken
  extends Model<RefreshTokenAttrs, RefreshTokenCreation>
  implements RefreshTokenAttrs
{
  public id!: number;
  public usuario_id!: number;
  public jti!: string;
  public hash_token!: string;
  public expira_en!: Date;
  public revocado_en!: Date | null;
  public ip!: string | null;
  public agente_usuario!: string | null;
  public fecha_creacion!: Date;
  public fecha_actualizacion!: Date;
}

RefreshToken.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    jti: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    hash_token: { type: DataTypes.CHAR(64), allowNull: false, unique: true },
    expira_en: { type: DataTypes.DATE, allowNull: false },
    revocado_en: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    ip: { type: DataTypes.STRING(64), allowNull: true },
    agente_usuario: { type: DataTypes.STRING(255), allowNull: true },
    fecha_creacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    modelName: 'refreshToken',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);