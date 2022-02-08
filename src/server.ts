import { config } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";

import "./database";
import { createConnection } from "typeorm";
import { UpdateBlockRoutine } from "./UpdateBlockRoutine";

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


/*
TESTING
*/
const updateBlockRoutine = new UpdateBlockRoutine();

const updateDBToOnChainInfo = async() => {
    var lastBlockOnChain = await updateBlockRoutine.getLastBlockOnChain();
    var lastBlockOnDB = await updateBlockRoutine.getLastBlockOnDB() + 1;

    while(lastBlockOnDB != lastBlockOnChain){
        let timer = Date.now();
        console.log(`> ${lastBlockOnDB} started...`);
        await updateBlockRoutine.getNextBlockDataFromOpenSea(lastBlockOnDB);
        console.log(`> ${lastBlockOnDB} finished in ${(Date.now() - timer)/1000} seconds`);

        var lastBlockOnChain = await updateBlockRoutine.getLastBlockOnChain();
        lastBlockOnDB++;
    }
    setTimeout(updateDBToOnChainInfo, 1000);
}

updateDBToOnChainInfo();

}).catch(error => console.log("Data Access Error : ", error));

