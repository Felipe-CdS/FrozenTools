import { Router } from "express";
import { AddNewCollectionController } from "./Controllers/AddNewCollectionController";
import { GetAllCollectionsController } from "./Controllers/GetAllCollectionsController";
import { GetCollectionByTokenAdressController } from "./Controllers/GetCollectionByTokenAdressController";

const addNewCollectionController = new AddNewCollectionController();
const getByTokenAdressController = new GetCollectionByTokenAdressController();
const getAllCollectionsController = new GetAllCollectionsController();

const router = Router();

router.get("/collection/:token_address",        getByTokenAdressController.handle	);
router.get("/all-collections",       			getAllCollectionsController.handle	);
router.get("/new-collection/:token_address",    addNewCollectionController.handle	);

export { router }