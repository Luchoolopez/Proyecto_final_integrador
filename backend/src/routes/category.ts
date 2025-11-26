import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const categoryRouter = Router();
const categoryController = new CategoryController();

// Rutas publicas
categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/:id', categoryController.getCategoryById);

// Rutas protegidas
categoryRouter.use(AuthMiddleware.authenticate);
// Aplicar middleware de autorización (solo admin) a las rutas que modifican datos
categoryRouter.use(AuthMiddleware.authorizeRoles('admin'));

categoryRouter.post('/', categoryController.createCategory);
categoryRouter.put('/:id', categoryController.updateCategory);
categoryRouter.delete('/:id', categoryController.deleteCategory);

export default categoryRouter;
export { categoryRouter as Router };

