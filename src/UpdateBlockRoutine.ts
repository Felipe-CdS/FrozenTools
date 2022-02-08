import { getCustomRepository } from "typeorm";
import { OpenseaTxnRepositories } from "./Repositories/OpenseaTxnRepositories";
import { AbiItem, fromWei, toHex, sha3, hexToNumber } from "web3-utils";
import { abi_ } from "./Abi/abi";
import Web3 from "web3"

interface ITxnData {
    timestamp: string;
    blockNumber: number;
    hash: string;
    tokenAddress: string;    
    tokenId: string;
    value: number;    
}

class UpdateBlockRoutine {

    apiString: string;
    contractAddress: string;
    openseaTxnRepository: OpenseaTxnRepositories;
    web3: Web3;

    constructor(){
        this.apiString = process.env.ALCHEMY_API_STRING;
        this.contractAddress = "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b";
        this.openseaTxnRepository = getCustomRepository(OpenseaTxnRepositories);
        this.web3 = new Web3(Web3.givenProvider || this.apiString);
    }

    async getLastBlockOnChain(): Promise<number> {
        const apiString = process.env.ALCHEMY_API_STRING;
        const web3 = new Web3(Web3.givenProvider || apiString);
        const blockNumber = await web3.eth.getBlockNumber();    
        return blockNumber;
    }

    async getLastBlockOnDB(): Promise<number> { 
        const { block_number } = await this.openseaTxnRepository.findOne({ order: { block_number: "DESC" } });
        console.log(block_number);
        return block_number;
    }

    async getNextBlockDataFromOpenSea(block_number : number) {
        const response = await this.getSingleBlockData(block_number);
            
        for(let i = 0; i < response.dataArray.length; i++){
            let txnData = response.dataArray[i];

            const txn = this.openseaTxnRepository.create({
                txn_timestamp: txnData.timestamp,
                block_number: txnData.blockNumber,
                txn_hash: txnData.hash,
                token_address: txnData.tokenAddress,
                token_id: txnData.tokenId,
                value: txnData.value    
            });
        
            await this.openseaTxnRepository.save(txn);
        }

        console.log(`> ${block_number} saved!`);
    }

    async getSingleBlockData(blockNumber: number) {

        const contract = new this.web3.eth.Contract(abi_ as AbiItem[], this.contractAddress);

        const response = await contract.getPastEvents("OrdersMatched", { "fromBlock": blockNumber, "toBlock": blockNumber });
        
        const hashArray = response.map(obj => { return obj.transactionHash });

        const dataArray = [];

        for(let i = 0; i < hashArray.length; ++i){
            try{
                let txn = await this.getSingleTxnData(hashArray[i]);
                dataArray.push(txn as ITxnData);
            }
            catch(err){
                console.log(hashArray[i], err.message); // return error hashs in response
            }      
        }
        
        return {"Total:": hashArray.length, dataArray};
    }

    async getSingleTxnData(txnHash: string){

        let txnData = await this.web3.eth.getTransaction(txnHash);
        let receipt = await this.web3.eth.getTransactionReceipt(txnHash);
        let blockData = await this.web3.eth.getBlock(txnData.blockNumber);

        let tokenAddress = "";
        let tokenIdArray = [];
        let value = parseFloat(fromWei(txnData.value));
        let timestamp = blockData.timestamp.toString();      

        // Find address Loop
        for(let i = 0; i < receipt.logs.length; i++){
            if(receipt.logs[i].topics[0] == sha3("Approval(address,address,uint256)")){
                tokenAddress = receipt.logs[i].address.toLowerCase();
                break;
            }
        }

        if(tokenAddress == ""){ throw new Error("Not a valid ERC-721 Token;") }
        
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

        if(tokenIdArray.length == 0){ throw new Error("Not a valid ERC-721 Token;") }

        let txn: ITxnData = 
        {
            timestamp,
            blockNumber: txnData.blockNumber,
            hash: txnHash, 
            tokenAddress,            
            tokenId: JSON.stringify(tokenIdArray),
            value            
        }
        
        return (txn);
    }

}

export { UpdateBlockRoutine }