import { Request, Response } from "express";
import { AddNewCollectionService } from "../Services/AddNewCollectionService";

class AddNewCollectionController {

    async handle(request:Request, response:Response){
        const { token_address } = request.params;
        const service = new AddNewCollectionService();
        const data = await service.execute(token_address);     
        
        if(data)
            return response.status(200).json({data});

        return response.status(400).json({message: "We already have this collection..."});           
    }
}

export { AddNewCollectionController }