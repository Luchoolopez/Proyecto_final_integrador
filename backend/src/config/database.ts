import 'dotenv/config';
import { Sequelize } from "sequelize";

const NODE_ENV = process.env.NODE_ENV;

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Falta variable env: ${key}`)
    }
    return value;
}

const sequelize = new Sequelize(
    requireEnv("DB_NAME"),
    requireEnv("DB_USER"),
    requireEnv("DB_PASSWORD"),
    {
        host: requireEnv("DB_HOST"),
        port: parseInt(process.env.DB_PORT || "3306"),
        dialect: "mysql",
        logging: NODE_ENV === "development" ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

//esta funcion permite que el mysql se configure primero antes que el back para evitar errores
async function connectWithRetry(attempts = 5, delay = 3000) {
    for (let i = 1; i <= attempts; i++) {
        try {
            await sequelize.authenticate();
            console.log("✅ DB conectada con Sequelize");
            return true;
        } catch (error) {
            console.error(`❌ Intento ${i}/${attempts} - Error conectando a la DB`);
            
            if (i === attempts) {
                throw error;
            }
            
            // Espera antes del próximo intento
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export { sequelize, connectWithRetry }