import { Router } from "express";
import { AlchemyRequestController } from "./Controllers/AlchemyRequestController";
import { EtherscanRequestController } from "./Controllers/EtherscanRequestController";

const router = Router();

const etherscanRequestController = new EtherscanRequestController();
const alchemyRequestController = new AlchemyRequestController();

router.get("/etherscan", etherscanRequestController.handle);
router.get("/alchemy", alchemyRequestController.handle);

export { router }