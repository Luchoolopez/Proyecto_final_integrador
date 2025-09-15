import express from 'express';
import corsConfig from './config/cors';
import config from './config/config';
import { router } from './routes';
import { dbConnect } from './config/database';
const app = express();

app.use(express.json());
app.use(corsConfig);
app.use(router);

app.listen(config.port, async()=> {
    console.log(`Servidor corriendo en el puerto ${config.port}`);
    await dbConnect();
})