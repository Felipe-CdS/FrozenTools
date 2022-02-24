import { getCustomRepository } from "typeorm";
import Web3 from "web3"
import { AbiItem } from "web3-utils";
import { Contract, EventData } from "web3-eth-contract"
import { abi_ } from "../Abi/abi";
import { Web3MiscMethods } from "./Web3MiscMethods";
import { LastBlockLogRepositories } from "../Repositories/LastBlockLogRepositories";
import { OpenseaTxnRepositories } from "../Repositories/OpenseaTxnRepositories";
import { OtherTxnRepositories } from "../Repositories/OtherTxnRepositories";

/*
*  ===============================================================
*  This class should do the same algorithm as UpdateBlockRoutine
*  but faster. The first blocks of the OpenSea contract wasn't so
*  large, so the idea here is to call many blocks each time instead
*  of 1 by 1.
*  ================================================================
*/

class UpdateRoutineFFW {

    apiString: string;
    contractAddress: string;
    openseaTxnRepository: OpenseaTxnRepositories;
    otherTxnRepository: OtherTxnRepositories;
    lastBlockLogRepository: LastBlockLogRepositories;
    web3: Web3;
    contract: Contract;

    constructor(){
        this.apiString = process.env.ALCHEMY_API_STRING;
        this.contractAddress = "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b";
        this.openseaTxnRepository = getCustomRepository(OpenseaTxnRepositories);
        this.otherTxnRepository = getCustomRepository(OtherTxnRepositories);
        this.lastBlockLogRepository = getCustomRepository(LastBlockLogRepositories);
        this.web3 = new Web3(Web3.givenProvider || this.apiString);
        this.contract = new this.web3.eth.Contract(abi_ as AbiItem[], this.contractAddress);
    }  
    
    public async updateRoutine(range: number) {
        do{
            let timer = Date.now();
            var lastBlockOnChain = await Web3MiscMethods.getLastBlockOnChain(this.web3);  
            var lastBlockOnDB = await this.lastBlockLogRepository.getLastBlockOnDB();
            
            console.log(`> ${lastBlockOnDB} to ${lastBlockOnDB+range} started...`);
            await this.getBlocksFromOpenSeaFFW(lastBlockOnDB, range);
            console.log(`> finished in ${(Date.now() - timer)/1000} seconds`);            
            
        } while(lastBlockOnDB != lastBlockOnChain);
    }

    async getBlocksFromOpenSeaFFW(blockNumber: number, range: number) {

        let data: EventData[];
        let hashArray: {transactionHash: string , blockNumber: number}[];

        do{
            data = await this.contract.getPastEvents("OrdersMatched", { "fromBlock": blockNumber, "toBlock": (blockNumber + range) });
            hashArray = data.map(obj =>  { return ({ transactionHash: obj.transactionHash, blockNumber: obj.blockNumber })});
            console.log(`>${hashArray.length} txns found`);

            if(hashArray.length > 1000){
                range /= 10;
            }
        } while(hashArray.length > 1000);

        for(let i = 0; i < hashArray.length; ++i){
            this.lastBlockLogRepository.setLastBlockOnDB(hashArray[i].blockNumber);
            let txn = await Web3MiscMethods.getSingleTxnData(this.web3, hashArray[i].transactionHash);

            if(txn.token_address != null){
                this.openseaTxnRepository.saveOpenSeaTxnOnDB(txn as ITxnData);
            }
            else{
                this.otherTxnRepository.saveOtherTxnOnDB(txn as IOtherTxnData);
            }
            process.stdout.write(".");
        }
        console.log("");
        //Add a return code
    }
}

interface ITxnData {
    timestamp: string;
    block_number: number;
    txn_hash: string;
    token_address: string;    
    token_id_array: string[];
    value: number;
}

interface IOtherTxnData {
    txn_hash: string;
    token_address: null;
}

export { UpdateRoutineFFW }