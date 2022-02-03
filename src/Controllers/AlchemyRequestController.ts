import { Request, Response } from "express";
import { AlchemyRequestService } from "../Services/AlchemyRequestService";

class AlchemyRequestController {

    async handle(req: Request, res: Response){

        const contractAddress = "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b";
        let blockNumber: string = "latest";

        if (req.query.blockNumber) 
            blockNumber = (req.query as any).blockNumber;
        
        const alchemyRequestService = new AlchemyRequestService();
       
        const data = await alchemyRequestService.execute(contractAddress, blockNumber);

        return res.json(data);
    }
}

export { AlchemyRequestController }