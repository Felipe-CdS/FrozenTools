import { Request, Response } from "express";
import { GetAllCollectionsService } from "../Services/GetAllCollectionsService";

class GetAllCollectionsController {

    async handle(request:Request, response:Response){

        const service = new GetAllCollectionsService();
        const data = await service.execute();
        return response.json(data);
    }
}


export { GetAllCollectionsController }