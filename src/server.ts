import { config } from "dotenv";
import express from "express"
import { router } from "./routes";

import "./database";


config(); // Env vars setup

const app = express();

app.use(express.json());

app.use(router);

app.listen(3000, () => { console.log("Server Up!") });