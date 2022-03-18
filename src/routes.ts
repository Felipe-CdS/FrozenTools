import { Router } from "express";
import { AddNewCollectionController } from "./Controllers/AddNewCollectionController";
import { GetCollectionByTokenAdressController } from "./Controllers/GetCollectionByTokenAdressController";

const addNewCollectionController = new AddNewCollectionController();
const getByTokenAdressController = new GetCollectionByTokenAdressController();

const router = Router();

router.get("/collection/:token_address",        getByTokenAdressController.handle);
router.get("/new-collection/:token_address",    addNewCollectionController.handle);

export { router }