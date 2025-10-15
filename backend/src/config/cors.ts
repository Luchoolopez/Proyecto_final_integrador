import cors from 'cors';

const corsOptions: cors.CorsOptions = {
    origin: [
        'http://localhost:5173', 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

export default cors(corsOptions);