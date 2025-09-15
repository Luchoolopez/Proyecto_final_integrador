import 'dotenv/config';
import mysql from 'mysql2/promise';

const NODE_ENV = process.env.NODE_ENV;

let pool: mysql.Pool;

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Falta variable env: ${key}`)
    }
    return value;
}

async function dbConnect(): Promise<void> {
    if (!pool) {
        pool = mysql.createPool({
            host: requireEnv('DB_HOST'),
            port: parseInt(process.env.DB_PORT || '3306'),
            user: requireEnv('DB_USER'),
            password: requireEnv('DB_PASSWORD'),
            database: requireEnv('DB_NAME'),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        console.log(`DB conectada a ${process.env.DB_NAME} [${NODE_ENV}]`);
    }
}

export { dbConnect, pool }