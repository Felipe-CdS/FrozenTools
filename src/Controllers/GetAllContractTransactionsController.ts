import { Request, Response } from "express";
import { GetAllContractTransactionsService } from "../Services/GetAllContractTransactionsService";

class GetAllContractTransactionsController {

    async handle(request:Request, response:Response){

        const { contractAddress } = request.body;

        const service = new GetAllContractTransactionsService();
        const data = await service.execute(contractAddress);
        
        return response.json(data);
    }
}


export { GetAllContractTransactionsController }