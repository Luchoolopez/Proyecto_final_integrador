import express from 'express';
import cors from 'cors'
import config from './config/config';
import { router } from './routes';
import { dbConnect } from './config/mysql';
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(config.port, async()=> {
    console.log(`Servidor corriendo en el puerto ${config.port}`);
    await dbConnect();
})