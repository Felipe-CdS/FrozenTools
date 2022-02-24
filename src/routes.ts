import { Router } from "express";
import { TestTxnController } from "./Controllers/TestTxnController";
import { CheckDBSavedController } from "./Controllers/CheckDBSavedController";
import { GetAllContractTransactionsController } from "./Controllers/GetAllContractTransactionsController";


const testTxnController = new TestTxnController();
const checkDBSavedController = new CheckDBSavedController();
const getAllContractTransactionsController = new GetAllContractTransactionsController();

const router = Router();

router.get("/txn/:txn_hash", testTxnController.handle);
router.get("/checkdb", checkDBSavedController.handle);
router.get("/contract-transactions", getAllContractTransactionsController.handle);

export { router }