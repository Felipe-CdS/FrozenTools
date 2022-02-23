import Web3 from "web3"
import { Request, Response } from "express";
import { Web3MiscMethods } from "../Services/Web3MiscMethods";

class TestTxnController {

    async handle(request:Request, response:Response){
        const apiString = process.env.ALCHEMY_API_STRING;
        const web3 = new Web3(Web3.givenProvider || apiString);
        const { txn_hash } = request.params;
        const data = await Web3MiscMethods.getSingleTxnData(web3, txn_hash);

        return response.json({data});
    }

}

export { TestTxnController }