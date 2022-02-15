import { getCustomRepository } from "typeorm";
import { OpenseaTxnRepositories } from "../Repositories/OpenseaTxnRepositories";
import { OtherTxnRepositories } from "../Repositories/OtherTxnRepositories";
import { AbiItem, fromWei, toHex, sha3, hexToNumber } from "web3-utils";
import { abi_ } from "../Abi/abi";
import Web3 from "web3"
import { Contract, EventData } from "web3-eth-contract"
import { BlockTransactionString, Transaction, TransactionReceipt } from "web3-eth"

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
    web3: Web3;
    contract: Contract;

    constructor(){
        this.apiString = process.env.ALCHEMY_API_STRING;
        this.contractAddress = "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b";
        this.openseaTxnRepository = getCustomRepository(OpenseaTxnRepositories);
        this.otherTxnRepository = getCustomRepository(OtherTxnRepositories);
        this.web3 = new Web3(Web3.givenProvider || this.apiString);
        this.contract = new this.web3.eth.Contract(abi_ as AbiItem[], this.contractAddress);
    }  
    
    public async updateRoutine(range) {
        let nextRange = range;
        var lastBlockOnChain = await this.getLastBlockOnChain();        
        var lastBlockOnDB = await this.getLastBlockOnDB() + 1;  // Production Version;
        // var lastBlockOnDB =  5919442;
        // var lastBlockOnDB = 14135713                            // Testing Version;        
    
        while(lastBlockOnDB != lastBlockOnChain){
            let timer = Date.now();
            console.log(`> ${lastBlockOnDB} started...`);
            nextRange = await this.getBlocksFromOpenSeaFFW(lastBlockOnDB, range);
            console.log(`> ${lastBlockOnDB} finished in ${(Date.now() - timer)/1000} seconds`);
    
            var lastBlockOnChain = await this.getLastBlockOnChain();
            lastBlockOnDB += nextRange;
        }
        setTimeout(((nextRange) => {this.updateRoutine(nextRange)}), 1000);
    }

    async getBlocksFromOpenSeaFFW(blockNumber: number, range: number) {

        let data: EventData[];
        let hashArray: string[];

        do{
            data = await this.contract.getPastEvents("OrdersMatched", { "fromBlock": blockNumber, "toBlock": (blockNumber + range) });
            hashArray = data.map(obj => { return obj.transactionHash });
            console.log(`>${hashArray.length} txn found`);
            if(hashArray.length > 1000){
                range /= 10;
            }            

        } while(hashArray.length > 1000);
        
        

        for(let i = 0; i < hashArray.length; ++i){  
            let txn = await this.getSingleTxnData(hashArray[i]);

            if(txn.token_address != null){
                this.saveOpenSeaTxnOnDB(txn as ITxnData);
            }
            else{
                this.saveOtherTxnOnDB(txn as IOtherTxnData);
            }
        }

        return range;
        //Add a return code
    }

    private async getSingleTxnData(txnHash: string){

        let tokenAddress: string, timestamp: string, value: number;
        let tokenIdArray: number[] = [];

        let txnData: Transaction = null;        
        let blockData: BlockTransactionString = null;
        let receipt = await this.web3.eth.getTransactionReceipt(txnHash);  

        // Find address Loop
        for(let i = 0; i < receipt.logs.length; i++){
            if(receipt.logs[i].topics[0] == sha3("Approval(address,address,uint256)")){
                tokenAddress = receipt.logs[i].address.toLowerCase();
                break;
            }
        }

        if(tokenAddress == ""){ 
            let otherTxn: IOtherTxnData = { txn_hash: txnHash, token_address: null }
            return (otherTxn);
        }
        
        for(let i = 0; i < receipt.logs.length; i++){
            let log = receipt.logs[i];            
            if(log.topics[0] == sha3("Transfer(address,address,uint256)")){
                // Find Token ID's Loop
                if(log.address.toLowerCase() == tokenAddress){
                    tokenIdArray.push(hexToNumber(log.topics[3]));               
                }
                // Get value in bid auction wins
                else{
                    value = Math.max(value, parseFloat(fromWei(log.data)));
                }
            }
        }

        if(tokenIdArray[0] == null){ 
            let otherTxn: IOtherTxnData = { txn_hash: txnHash, token_address: null }
            return (otherTxn);
        }

        txnData = await this.web3.eth.getTransaction(txnHash);        
        blockData = await this.web3.eth.getBlock(txnData.blockNumber);
        timestamp = blockData.timestamp.toString(); 
        value = parseFloat(fromWei(txnData.value));

        let txn: ITxnData = 
        {
            txn_timestamp: timestamp,
            block_number: txnData.blockNumber,
            txn_hash: txnHash, 
            token_address: tokenAddress,
            token_id: JSON.stringify(tokenIdArray),
            value            
        }
        
        return (txn);
    }

    private async saveOpenSeaTxnOnDB(txn: ITxnData){
        const { txn_timestamp, block_number, txn_hash, token_address, token_id, value } = txn;
        const txn_entity = this.openseaTxnRepository.create({ txn_timestamp, block_number, txn_hash, token_address, token_id, value });
        await this.openseaTxnRepository.save(txn_entity);
    }

    private async saveOtherTxnOnDB(txn: IOtherTxnData){
        const { txn_hash } = txn;
        const txn_entity = this.otherTxnRepository.create({ txn_hash });
        await this.otherTxnRepository.save(txn_entity);
    }

    private async getLastBlockOnChain(): Promise<number> {
        const blockNumber = await this.web3.eth.getBlockNumber();    
        return blockNumber;
    }

    private async getLastBlockOnDB(): Promise<number> { 
        const { block_number } = await this.openseaTxnRepository.findOne({ order: { block_number: "DESC" } });
        return block_number;
    }
}

interface ITxnData {
    txn_timestamp: string;
    block_number: number;
    txn_hash: string;
    token_address: string;    
    token_id: string;
    value: number;
}

interface IOtherTxnData {
    txn_hash: string;
    token_address: null;
}

export { UpdateRoutineFFW }