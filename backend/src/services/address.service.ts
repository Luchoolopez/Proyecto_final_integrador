import { sequelize } from '../config/database';
import { Op, WhereOptions } from 'sequelize';
import { Address } from '../models';
import { AddressAttributes } from '../models/address.model';
import { CreateAddressInput, UpdateAddressInput } from '../validations/address.schema';
import { ERROR_MESSAGES } from '../utils/address/address.constants'; 

export class AddressService {
    
    async getAddressesByUser(usuario_id: number): Promise<Address[]> {
        try {
            const addresses = await Address.findAll({
                where: { usuario_id },
                order: [['es_principal', 'DESC']],
            });
            return addresses;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.GET_ADDRESSES_ERROR);
        }
    }

    async getAddressById(id: number, usuario_id: number): Promise<Address> {
        try {
            const address = await Address.findOne({ where: { id, usuario_id } });
            if (!address) {
                throw new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
            }
            return address;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || ERROR_MESSAGES.GET_ADDRESS_ERROR);
            }
            throw error;
        }
    }

    // CAMBIO 2: Usamos CreateAddressInput en lugar de Omit<AddressCreationAttributes...>
    async createAddress(data: CreateAddressInput, usuario_id: number): Promise<Address> {
        try {
            if (data.es_principal) {
                await this.clearPrincipalFlag(usuario_id);
            }

            // Sequelize acepta el objeto data porque coincide en estructura
            const newAddress = await Address.create({
                ...data,
                usuario_id,
            });

            return newAddress;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.CREATE_ADDRESS_ERROR);
        }
    }

    // CAMBIO 3: Usamos UpdateAddressInput
    async updateAddress(id: number, data: UpdateAddressInput, usuario_id: number): Promise<Address> {
        try {
            const address = await Address.findOne({ where: { id, usuario_id } });
            
            if (!address) {
                throw new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
            }

            if (data.es_principal) {
                await this.clearPrincipalFlag(usuario_id, id);
            }

            await address.update(data);
            return address;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || ERROR_MESSAGES.UPDATE_ADDRESS_ERROR);
            }
            throw error;
        }
    }

    async deleteAddress(id: number, usuario_id: number): Promise<void> {
        try {
            const address = await Address.findOne({ where: { id, usuario_id } });
            
            if (!address) {
                throw new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
            }
            
            await address.destroy();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || ERROR_MESSAGES.DELETE_ADDRESS_ERROR);
            }
            throw error;
        }
    }

    async setPrincipalAddress(id: number, usuario_id: number): Promise<Address> {
        const transaction = await sequelize.transaction();
        try {
            await Address.update(
                { es_principal: false },
                { where: { usuario_id }, transaction }
            );

            const address = await Address.findOne({ 
                where: { id, usuario_id },
                transaction 
            });

            if (!address) {
                throw new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
            }

            address.es_principal = true;
            await address.save({ transaction });

            await transaction.commit();
            return address;
        } catch (error) {
            await transaction.rollback();
            if (error instanceof Error) {
                throw new Error(error.message || ERROR_MESSAGES.SET_PRINCIPAL_ERROR);
            }
            throw error;
        }
    }

    private async clearPrincipalFlag(usuario_id: number, excludeId?: number) {
        try {
            const where: WhereOptions<AddressAttributes> = { usuario_id };
            
            if (excludeId) {
                where.id = { [Op.ne]: excludeId }; 
            }

            await Address.update({ es_principal: false }, { where });
        } catch (error) {
             throw new Error(ERROR_MESSAGES.UPDATE_ADDRESS_ERROR);
        }
    }
}

export const addressService = new AddressService();