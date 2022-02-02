import { Request, Response } from "express";
import { EtherscanRequestService } from "../Services/EtherscanRequestService";

class EtherscanRequestController {

    async handle(request: Request, response: Response){
        const etherscanRequestService = new EtherscanRequestService();

        const data = await etherscanRequestService.execute();
        
        return response.json(data);
    }
}

export { EtherscanRequestController }