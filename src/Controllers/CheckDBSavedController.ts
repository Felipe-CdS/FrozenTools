import Web3 from "web3"
import { Request, Response } from "express";
import { Web3MiscMethods } from "../Services/Web3MiscMethods";
import { getCustomRepository } from "typeorm";
import { OpenseaTxnRepositories } from "../Repositories/OpenseaTxnRepositories";
import { OtherTxnRepositories } from "../Repositories/OtherTxnRepositories";

class CheckDBSavedController {

    async handle(request:Request, response:Response){

        const apiString = process.env.ALCHEMY_API_STRING;
        const web3 = new Web3(Web3.givenProvider || apiString);
        const { txn_hash } = request.body;
        const data = await Web3MiscMethods.getSingleTxnData(web3, txn_hash);        

        if(data.token_address != null){
            return response.json({message: "saved on OpenSeaTxn", data});
        }
        else{
            return response.json({message: "saved on OtherTxn", data});
        }        
    }
}


export { CheckDBSavedController }