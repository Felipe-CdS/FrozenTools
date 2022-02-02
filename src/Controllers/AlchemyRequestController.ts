import { Request, Response } from "express";
import { AlchemyRequestService } from "../Services/AlchemyRequestService";

class AlchemyRequestController {

    async handle(req: Request, res: Response){
        const alchemyRequestService = new AlchemyRequestService();

        const data = await alchemyRequestService.execute();

        return res.json(data);
    }
}

export { AlchemyRequestController }