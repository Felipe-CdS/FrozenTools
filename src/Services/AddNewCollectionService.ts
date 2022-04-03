import axios from "axios";
import { getCustomRepository } from "typeorm";
import { ICollection } from "../Entities/Collection";
import { Itransaction } from "../Entities/Transaction";
import { CollectionRepositories } from "../Repositories/CollectionRepositories";
import { TransactionRepositories } from "../Repositories/TransactionRepositories";

class AddNewCollectionService {

    async tryGetMoreOpenSeaInfo(address:string, name: string){
        let api_string = "https://api.opensea.io/api/v1/collection/" + name;

        try{
            let response = await axios.get(api_string).then((resp) => resp.data.collection);
            let response_token_address = (response.primary_asset_contracts[0].address).toLowerCase();

            if(response_token_address == address){
                let { image_url, twitter_username, discord_url, opensea_slug, holders } = response;
                opensea_slug = response.slug;
                holders      = response.stats.num_owners;
                return({ image_url, twitter_username, discord_url, opensea_slug, holders });
            }
        }
        catch(err){
            return(undefined);
        }        
        return(undefined);
    }

    async getCollectionMetadata(token_address: string, collectionRepository:CollectionRepositories, Moralis){
        let new_collection: ICollection;

        const { name, symbol, contract_type }   = await Moralis.Web3API.token.getNFTMetadata({ address: token_address });
        const tokensTotalResp                   = await Moralis.Web3API.token.getAllTokenIds({ address: token_address, limit: 1 });
        const openSeaInfo                       = await this.tryGetMoreOpenSeaInfo(token_address, (name).toLowerCase());    

        new_collection = { 
            token_address, 
            name, symbol, 
            contract_type, 
            total_supply: tokensTotalResp.total,
        };

        if(openSeaInfo != undefined){
            let { image_url, twitter_username, discord_url, opensea_slug, holders } = openSeaInfo;
            new_collection.image_url        = image_url;
            new_collection.twitter_username = twitter_username;
            new_collection.discord_url      = discord_url;
            new_collection.opensea_slug     = opensea_slug;
            new_collection.holders          = holders;
        }
        
        await collectionRepository.save(collectionRepository.create(new_collection));
        return new_collection;
    }

    async getAllTransactions(address:string, transactionRepository:TransactionRepositories, Moralis){
        let totalTxns: number = 0;
        let txnCounter: number = 0;
        let offset: number = 0;

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
                    block_number: txnData.block_number                 
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
    }

    async execute(address: string){
        const transactionRepository = getCustomRepository(TransactionRepositories);      
        const collectionRepository  = getCustomRepository(CollectionRepositories);  

        const Moralis = require('moralis/node');
        const serverUrl = "https://hed88ucyoyfw.usemoralis.com:2053/server";
        const appId = "6bwhjNOs2BJIDVfnie39PmtLYMUnI02BNMmhRkvb";
        Moralis.start({ serverUrl, appId });

        address = address.toLowerCase();

        const check_duplicate = await collectionRepository.findOne({token_address: address});

        if(check_duplicate == undefined){
            const data = await this.getCollectionMetadata(address, collectionRepository, Moralis);
            this.getAllTransactions(address, transactionRepository, Moralis);       
            return(data);     
        }
    }
}

export { AddNewCollectionService }