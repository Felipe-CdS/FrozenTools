import { Router } from "express";
import { TestTxnController } from "./Controllers/TestTxnController";
import { CheckDBSavedController } from "./Controllers/CheckDBSavedController";
import { GetAllContractTransactionsController } from "./Controllers/GetAllContractTransactionsController";
import { AddNewCollectionController } from "./Controllers/AddNewCollectionController";


const testTxnController = new TestTxnController();
const checkDBSavedController = new CheckDBSavedController();
const getAllContractTransactionsController = new GetAllContractTransactionsController();
const addNewCollectionController = new AddNewCollectionController();

const router = Router();

router.get("/txn/:txn_hash", testTxnController.handle);
router.get("/checkdb/:txn_hash", checkDBSavedController.handle);
router.get("/contract-transactions/:contractAddress", getAllContractTransactionsController.handle);
router.get("/new-collection/:address", addNewCollectionController.handle);

export { router }