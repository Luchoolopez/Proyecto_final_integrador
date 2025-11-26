import cors from 'cors';

import 'dotenv/config'; 

const allowedOrigins = [
    'http://localhost:5173', // Para desarrollo local
    process.env.CLIENT_URL   // Para producción (Vercel)
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Permitir requests sin origen 
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin === process.env.CLIENT_URL) {
            callback(null, true);
        } else {
            console.error(`Bloqueado por CORS: ${origin}`); 
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
};

export default cors(corsOptions);

