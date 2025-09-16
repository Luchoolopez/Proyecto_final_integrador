import express from 'express';
import corsConfig from './config/cors';
import config from './config/config';
import { router } from './routes';
import { sequelize } from './config/database';
const app = express();

app.use(express.json());
app.use(corsConfig);
app.use(router);

async function connectWithRetry(attempts = 5, delay = 3000) {
    for (let i = 1; i <= attempts; i++) {
        try {
            await sequelize.authenticate();
            console.log("✅ DB conectada con Sequelize");
            return true;
        } catch (error) {
            console.error(`❌ Intento ${i}/${attempts} - Error conectando a la DB:`, error);
            
            if (i === attempts) {
                throw error;
            }
            
            // Espera antes del próximo intento
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

app.listen(config.port, async()=> {
    console.log(`Servidor corriendo en el puerto ${config.port}`);
    try{
        await connectWithRetry();
        console.log("DB conectado")
    }catch(error){
        console.error("Error conectando a la DB:", error);
    }
})