import { getCustomRepository } from "typeorm";
import { OpenseaTxnRepositories } from "../Repositories/OpenseaTxnRepositories";
import { ITxnData } from "../Interfaces/ITxnData";
import {  fromWei, sha3, hexToNumberString } from "web3-utils";

class AddNewCollectionService {

    async execute(address: string){
        let totalTxns: number = 0;
        let txnCounter: number = 0;
        let offset: number = 0;

        const openseaTxnRepository = getCustomRepository(OpenseaTxnRepositories);

        const Moralis = require('moralis/node');
        const serverUrl = "https://hed88ucyoyfw.usemoralis.com:2053/server";
        const appId = "6bwhjNOs2BJIDVfnie39PmtLYMUnI02BNMmhRkvb";
        Moralis.start({ serverUrl, appId });

        do{
            let response = await Moralis.Web3API.token.getNFTTrades({ address, offset });
            totalTxns = response.total;            
            
            for(let i = 0; i < response.result.length; ++i){
                let txn_hash = (response.result[i].transaction_hash).toLowerCase();

                let txn: ITxnData = 
                {
                    txn_hash,
                    block_number: response.result[i].block_number,
                    token_address: address,    
                    token_id_array: response.result[i].token_ids,
                    value: parseFloat(fromWei(response.result[i].price)),
                    date: response.result[i].block_timestamp,
                };
                
                try{
                    await openseaTxnRepository.saveOpenSeaTxnOnDB(txn as ITxnData);
                }catch(err){
                    console.log("Possible duplicate! Error on", response.result[i].transaction_hash);
                }
                
                ++txnCounter;
                console.log("txn ", txnCounter, "from", totalTxns, "saved! | ", response.result[i].transaction_hash);
            }

            if(txnCounter == totalTxns) break; 
            if(response.result.length == 0) break; 

            offset += 500;
            console.log("Sleeping...");
            await new Promise((resolve) => { setTimeout(resolve, 5000) });
            console.log("Next!");

        }while(txnCounter < totalTxns);

        console.log("Done!");
        return(txnCounter);
    }
}


export { AddNewCollectionService }