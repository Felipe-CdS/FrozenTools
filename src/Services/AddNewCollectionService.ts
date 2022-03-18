import { getCustomRepository, TransactionRepository } from "typeorm";
import { Itransaction } from "../Entities/Transaction";
import { TransactionRepositories } from "../Repositories/TransactionRepositories";

class AddNewCollectionService {

    async execute(address: string){
        let totalTxns: number = 0;
        let txnCounter: number = 0;
        let offset: number = 0;

        const transactionRepository = getCustomRepository(TransactionRepositories);        

        const Moralis = require('moralis/node');
        const serverUrl = "https://hed88ucyoyfw.usemoralis.com:2053/server";
        const appId = "6bwhjNOs2BJIDVfnie39PmtLYMUnI02BNMmhRkvb";
        Moralis.start({ serverUrl, appId });

        const { name, symbol } =  (await Moralis.Web3API.token.getAllTokenIds({ address, limit: 1 })).result[0];

        do{
            let response = await Moralis.Web3API.token.getNFTTrades({ address, offset });
            totalTxns = response.total;            
            
            for(let i = 0; i < response.result.length; ++i){
                let txnData = response.result[i];

                let txn: Itransaction = 
                {
                    transaction_hash: (txnData.transaction_hash).toLowerCase(),
                    transaction_index: txnData.transaction_index,
                    token_ids: txnData.token_ids,
                    seller_address: (txnData.seller_address).toLowerCase(),
                    buyer_address: (txnData.buyer_address).toLowerCase(),
                    token_address: (txnData.token_address).toLowerCase(),
                    marketplace_address: (txnData.marketplace_address).toLowerCase(),
                    price: txnData.price,
                    block_timestamp: txnData.block_timestamp,
                    block_number: txnData.block_number,
                    name,
                    symbol                   
                };
                
                try{
                    await transactionRepository.saveTransactionOnDB(txn);
                }catch(err){
                    throw new Error(err);
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