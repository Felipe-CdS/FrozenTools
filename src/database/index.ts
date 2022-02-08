import { createConnection } from "typeorm";

const dbConnection = async() => {
    await createConnection();
}
