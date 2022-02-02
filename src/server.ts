import { config } from "dotenv";
import express from "express"
import { router } from "./routes";

config();
const app = express();

app.use(router);

app.listen(3000, () => { console.log("Server Up!") });