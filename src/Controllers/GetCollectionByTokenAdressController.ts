import { Request, Response } from "express";
import { GetCollectionByTokenAdressService } from "../Services/GetCollectionByTokenAdressService";

class GetCollectionByTokenAdressController {

    async handle(request:Request, response:Response){

        const { token_address } = request.params;
        const service = new GetCollectionByTokenAdressService();
        const data = await service.execute(token_address.toLowerCase());
        return response.json(data);
    }
}


export { GetCollectionByTokenAdressController }