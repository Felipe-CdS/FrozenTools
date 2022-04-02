import { Request, Response } from "express";
import { AddNewCollectionService } from "../Services/AddNewCollectionService";

class AddNewCollectionController {

    async handle(request:Request, response:Response){
        const { token_address } = request.params;
        const service = new AddNewCollectionService();
        const return_status = await service.execute(token_address);     
        
        if(return_status != undefined){
            return response.status(200).json({return_status});  
        }
        else{
            return response.status(400).json({message: "We already have this collection..."});  
        }        
    }
}

export { AddNewCollectionController }