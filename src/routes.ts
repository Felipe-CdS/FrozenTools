import { Router } from "express";
import { AddNewCollectionController } from "./Controllers/AddNewCollectionController";
import { GetAllCollectionsController } from "./Controllers/GetAllCollectionsController";
import { GetCollectionByTokenAdressController } from "./Controllers/GetCollectionByTokenAdressController";
import { GetCollectionInfoController } from "./Controllers/GetCollectionInfoController";

const addNewCollectionController = new AddNewCollectionController();
const getByTokenAdressController = new GetCollectionByTokenAdressController();
const getCollectionInfoController = new GetCollectionInfoController();
const getAllCollectionsController = new GetAllCollectionsController();

const router = Router();


router.get("/all-collections",       					getAllCollectionsController.handle	);
router.get("/collection/info/:entry",       			getCollectionInfoController.handle	);
router.get("/collection/transactions/:token_address",   getByTokenAdressController.handle	);
router.get("/new-collection/:token_address",    		addNewCollectionController.handle	);

export { router }