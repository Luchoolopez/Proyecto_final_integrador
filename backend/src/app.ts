import express from "express";
import { configureCloudinary } from "./config/cloudinary";
import cors from 'cors';
import { router } from "./routes";

export function makeApp() {
    const app = express();

    app.use(express.json());

    const corsOptions = {
        origin: [
            'http://localhost:5173', 
            'https://proyecto-final-integrador-7s4o-hxffgf9lf.vercel.app', 
            'https://proyecto-final-integrador.vercel.app', 
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        allowedHeaders: "Content-Type, Authorization",
        optionsSuccessStatus: 204
    };
    
    app.use(cors(corsOptions));
    app.use(express.urlencoded({extended: true}))
    configureCloudinary();
    
    app.use("/api", router);

    app.use((req, res) => { res.status(404).json({ message: "Not Found" }) });
    
    return app;
}