import cors from 'cors';


const corsOptions: cors.CorsOptions = {
    origin: [
        ' http://localhost:5173', //frontend local
        //agregar el frontend en produccion
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, //permite enviar cookies/tokens
};

export default cors(corsOptions);