import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const addressRouter = Router();
const addressController = new AddressController();

addressRouter.use(AuthMiddleware.authenticate);
addressRouter.get('/', addressController.getAddresses);
addressRouter.post('/', addressController.createAddress);
addressRouter.get('/:id', addressController.getAddressById);
addressRouter.put('/:id', addressController.updateAddress);
addressRouter.delete('/:id', addressController.deleteAddress);
addressRouter.patch('/:id/principal', addressController.setPrincipalAddress);

export default addressRouter;
export { addressRouter as Router}

