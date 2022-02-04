import { config } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";

import "./database";

config(); // Env vars setup

const app = express();

app.use(express.json());

app.use(router);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof Error) {
        return response.status(400).json({ error: err.message });
    }

    return response.status(500).json({ 
        status: "error",
        message: "Interal Server Error"
    });
});


app.listen(3000, () => { console.log("Server Up!") });