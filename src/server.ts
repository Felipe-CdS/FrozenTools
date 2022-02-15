import { config } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";

import "./database";
import { createConnection } from "typeorm";
import { UpdateBlockRoutine } from "./Services/UpdateBlockRoutine";
import { UpdateRoutineFFW } from "./Services/UpdateRoutineFFW";

config(); // Env vars setup

createConnection().then(async connection => {

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

new UpdateRoutineFFW().updateRoutine(100000);
//new UpdateBlockRoutine().updateRoutine();

}).catch(error => console.log("Data Access Error : ", error));

