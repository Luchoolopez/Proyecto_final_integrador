import { Router } from "express";
import { readdirSync } from "fs";

const PATH_ROUTER = __dirname;
const router = Router();

const cleanFileName = (fileName: string): string | undefined => {
    const file = fileName.split('.').shift();
    return file;
}

// Función asíncrona para cargar las rutas
const loadRoutes = async () => {
    const files = readdirSync(PATH_ROUTER);
    // Usamos for...of porque sí espera a los await internos, a diferencia de forEach
    for (const fileName of files) {
        const cleanName = cleanFileName(fileName);

        // Ignorar el archivo actual (index) y archivos que no sean de rutas
        if (cleanName && cleanName !== 'index') {
            try {
                // Usamos import() dinámico que funciona mejor con ES Modules
                const module = await import(`./${cleanName}`);
                const moduleRouter = module.router || module.default;

                if (moduleRouter) {
                    console.log(`✅ Ruta cargada y registrada: /api/${cleanName}`);
                    router.use(`/${cleanName}`, moduleRouter);
                } else {
                    console.warn(`⚠️  El módulo de ruta ${cleanName} no exporta un 'router' o un 'default'.`);
                }
            } catch (error) {
                console.error(`❌ Error al cargar la ruta /${cleanName}:`, error);
            }
        }
    }
};

loadRoutes();

export { router };