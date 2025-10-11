import { Router } from "express";
import { readdirSync } from "fs";

const PATH_ROUTER = __dirname;
const router = Router();

const cleanFileName = (fileName: string): string | undefined => {
    const file = fileName.split('.').shift();
    return file;
}

// Cargar rutas de forma síncrona
const loadRoutes = () => {
    const files = readdirSync(PATH_ROUTER);
    
    console.log('📁 Archivos encontrados en routes/:', files);
    
    files.forEach((fileName) => {
        // ✅ SOLO procesar archivos .js que NO sean .map ni .d.ts
        if (!fileName.endsWith('.js') || fileName.includes('.map') || fileName.includes('.d.ts')) {
            return;
        }

        const cleanName = cleanFileName(fileName);
        
        // Ignorar index.js
        if (cleanName && cleanName !== 'index') {
            try {
                console.log(`🔍 Cargando: ${fileName}`);
                const routeModule = require(`./${cleanName}`);
                
                if (routeModule.Router) {
                    console.log(`✅ Ruta registrada: ${cleanName}`);
                    router.use(`/${cleanName}`, routeModule.Router);
                } else if (routeModule.default) {
                    console.log(`✅ Ruta registrada (default): /api/${cleanName}`);
                    router.use(`/${cleanName}`, routeModule.default);
                } else {
                    console.log(`⚠️  El módulo ${cleanName} no tiene exportación válida`);
                }
            } catch (error) {
                console.error(`❌ Error cargando ruta ${cleanName}:`, error);
            }
        }
    });
};

loadRoutes();

export { router };