import cors from 'cors';
import 'dotenv/config'; 

const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL 
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || origin === process.env.CLIENT_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

export default cors(corsOptions);