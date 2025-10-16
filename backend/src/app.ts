import express from "express";
import { configureCloudinary } from "./config/cloudinary";
import cors from 'cors';
import { router } from "./routes";

import { Request, Response } from "express";
import {v2 as cloudianry} from 'cloudinary'

export function makeApp() {
    const app = express();

    // Middlewares
    app.use(express.json());

    // Configuración explícita de CORS
    const corsOptions = {
        origin: 'http://localhost:5173',
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
        credentials: true, // Permite el envío de cookies y cabeceras de autorización
        allowedHeaders: "Content-Type, Authorization", // Cabeceras permitidas
        optionsSuccessStatus: 204 // Para que las peticiones OPTIONS respondan con 204
    };
    app.use(cors(corsOptions));
    app.use(express.urlencoded({extended: true}))
    configureCloudinary();

    
    // Rutas
    app.use("/api", router);

    app.use((req, res) => res.status(404).json({ message: "Not Found" }));
    
    return app;
}
