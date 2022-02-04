import { getCustomRepository } from "typeorm";
import Web3 from "web3";
import { AbiItem, hexToNumberString, fromWei, toHex, sha3 } from "web3-utils";
import { abi_ } from "../Abi/abi";
import { OpenseaTxnRepositories } from "../Repositories/OpenseaTxnRepositories";

interface ITxnData {
    timestamp: string;
    blockNumber: number;
    hash: string;
    tokenAddress: string;    
    tokenId: string[];
    value: number;    
}

class AlchemyRequestService {   
    
    async getSingleTxnData(txnHash: string, web3: Web3){

        let txnData = await web3.eth.getTransaction(txnHash);
        let receipt = await web3.eth.getTransactionReceipt(txnHash);
        let blockData = await web3.eth.getBlock(txnData.blockNumber);

        let tokenAddress = "";
        let tokenId = [];
        let value = parseFloat(fromWei(txnData.value));
        let timestamp = blockData.timestamp.toString();        

        // Find address Loop
        for(let i = 0; i < receipt.logs.length; i++){
            let log = receipt.logs[i];
            if(log.topics[0] == sha3("Approval(address,address,uint256)")){
                tokenAddress = log.address.toLowerCase();
                break;
            }
        }
        
        for(let i = 0; i < receipt.logs.length; i++){
            let log = receipt.logs[i];            
            if(log.topics[0] == sha3("Transfer(address,address,uint256)")){
                // Find Token ID's Loop
                if(log.address.toLowerCase() == tokenAddress){
                    tokenId.push(hexToNumberString(log.topics[3]));               
                }
                // Get value in bid auction wins
                else{
                    value = Math.max(value, parseFloat(fromWei(log.data)));
                }
            }            
        }

        if(tokenId.length == 0 || tokenAddress == ""){
            throw new Error("Not a valid ERC-721 Token;");
        }

        let txn: ITxnData = 
        {
            timestamp,
            blockNumber: txnData.blockNumber,
            hash: txnHash, 
            tokenAddress,            
            tokenId,
            value            
        }

        return (txn);
    }

    async getSingleBlockData(apiString: string, contractAddress: string, blockNumber: string, web3: Web3){

        const contract = new web3.eth.Contract(abi_ as AbiItem[], contractAddress);

        if(blockNumber != "latest")
            blockNumber = toHex(blockNumber);

        const response = await contract.getPastEvents("OrdersMatched", { "fromBlock": blockNumber, "toBlock": blockNumber });
        
        const hashArray = response.map(obj => { return obj.transactionHash });

        const dataArray = [];

        for(let i = 0; i < hashArray.length; ++i){
            try{
                let txn = await this.getSingleTxnData(hashArray[i], web3);
                dataArray.push(txn as ITxnData);
            }
            catch(err){
                console.log(hashArray[i], err.message); // return error hashs in response
            }      
        }
        
        return {"Total:": hashArray.length, dataArray};
    }

    async execute(contractAddress: string, blockNumber: string){ 
        const openseaTxnRepository = getCustomRepository(OpenseaTxnRepositories);

        const apiString = process.env.ALCHEMY_API_STRING;
        const web3 = new Web3(Web3.givenProvider || apiString);        

        console.log("Requests API start");

        const response = await this.getSingleBlockData(apiString, contractAddress, blockNumber, web3);

        console.log("Requests API Ended... Starting to save");
        
        // for(let i = 0; i < response.dataArray.length; i++){
        //     let txnData = response.dataArray[i];

        //     const txn = openseaTxnRepository.create({
        //         txn_timestamp: txnData.timestamp,
        //         block_number: txnData.blockNumber,
        //         txn_hash: txnData.hash,
        //         token_address: txnData.tokenAddress,
        //         token_id: txnData.tokenId,
        //         value: txnData.value    
        //     });
    
        //     await openseaTxnRepository.save(txn);            
        // }   

        console.log("done!");

        return response;
    }
}

export { AlchemyRequestService }