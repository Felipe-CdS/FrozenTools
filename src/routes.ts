import { Router } from "express";
import { TestTxnController } from "./Controllers/TestTxnController";


const testTxnController = new TestTxnController();

const router = Router();

router.get("/txn/:txn_hash", testTxnController.handle);

export { router }