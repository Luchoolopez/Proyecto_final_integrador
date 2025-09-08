import express from 'express';
import { Request, Response } from 'express';
import config from './config/config';
const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send("hola mundo")
})

app.listen(config.port, ()=> {
    console.log(`Servidor corriendo en el puerto ${config.port}`);
})