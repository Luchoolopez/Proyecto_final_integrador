import express from "express";
import corsConfig from "./config/cors";
import { router } from "./routes";

export function makeApp() {
    const app = express();

    // Middlewares
    app.use(express.json());
    app.use(corsConfig);

    // Rutas
    app.use("/api", router);

    app.use((req, res) => res.status(404).json({ message: "Not Found" }));
    
    return app;
}
