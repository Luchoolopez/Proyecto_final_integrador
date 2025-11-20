import { Request, Response } from "express";
import { AddressService } from "../services/address.service";
import { createAddressSchema, updateAddressSchema } from "../validations/address.schema";
import { ERROR_MESSAGES } from "../utils/address/address.constants";
import { ZodError } from "zod";

export class AddressController {
    private addressService: AddressService;
    
    constructor() {
        this.addressService = new AddressService();
    }

    getAddresses = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id; 
            const addresses = await this.addressService.getAddressesByUser(usuario_id);

            return res.status(200).json({
                success: true,
                count: addresses.length,
                data: addresses
            });
        } catch (error) {
            let errorMessage = ERROR_MESSAGES.GET_ADDRESSES_ERROR;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({
                success: false,
                message: errorMessage,
                error: error
            });
        }
    };

    getAddressById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const address = await this.addressService.getAddressById(Number(id), usuario_id);
            return res.status(200).json({
                success: true,
                data: address
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.GET_ADDRESS_ERROR,
                error: error
            });
        }
    };

    createAddress = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;
            
            const parsedBody = createAddressSchema.parse(req.body);

            const newAddress = await this.addressService.createAddress(
                parsedBody,
                usuario_id
            );

            return res.status(201).json({
                success: true,
                message: 'Dirección creada exitosamente',
                data: newAddress
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.issues 
                });
            }
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.CREATE_ADDRESS_ERROR,
                error: error
            });
        }
    };

    updateAddress = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const parsedBody = updateAddressSchema.parse(req.body);

            const updatedAddress = await this.addressService.updateAddress(
                Number(id),
                parsedBody,
                usuario_id
            );

            return res.status(200).json({
                success: true,
                message: 'Dirección actualizada',
                data: updatedAddress
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.issues
                });
            }
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.UPDATE_ADDRESS_ERROR,
                error: error
            });
        }
    };

    deleteAddress = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            await this.addressService.deleteAddress(Number(id), usuario_id);

            return res.status(200).json({
                success: true,
                message: 'Dirección eliminada'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.DELETE_ADDRESS_ERROR,
                error: error
            });
        }
    };

    setPrincipalAddress = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const principalAddress = await this.addressService.setPrincipalAddress(Number(id), usuario_id);

            return res.status(200).json({
                success: true,
                message: 'Dirección establecida como principal',
                data: principalAddress
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.SET_PRINCIPAL_ERROR,
                error: error
            });
        }
    };
}