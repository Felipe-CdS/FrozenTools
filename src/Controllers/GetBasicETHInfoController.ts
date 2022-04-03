import { Request, Response } from "express";
import { GetBasicETHInfoService } from "../Services/GetBasicETHInfoService";

class GetBasicETHInfoController{
	async handle(request: Request, response: Response){
		const service = new GetBasicETHInfoService();
		const data = await service.execute();
		return response.status(200).json(data);
	}
}

export { GetBasicETHInfoController }

