import { Request, Response } from "express";
import { GetCollectionInfoService } from "../Services/GetCollectionInfoService";

class GetCollectionInfoController {

    async handle(request:Request, response:Response){

		const { entry } = request.params;

        const service = new GetCollectionInfoService();
        const data = await service.execute(entry);    
		
		if(data){
			return response.status(200).json({data});
		}

		return response.status(404).json({message: "We don't have this collection yet..."});
        
		
    }
}

export { GetCollectionInfoController }