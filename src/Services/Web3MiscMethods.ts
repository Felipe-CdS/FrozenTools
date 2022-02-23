import Web3 from "web3"
import {  fromWei, sha3, hexToNumberString } from "web3-utils";
import { BlockTransactionString, Transaction } from "web3-eth"

class Web3MiscMethods{

    static async getSingleTxnData(web3: Web3, txnHash: string){

        let tokenAddress: string, timestamp: string, value: number;
        let tokenIdArray: string[] = [];
    
        let txnData: Transaction = null;        
        let blockData: BlockTransactionString = null;
        let receipt = await web3.eth.getTransactionReceipt(txnHash);  

        txnData = await web3.eth.getTransaction(txnHash);
        tokenAddress = "0x" + (txnData).input.slice(290,330);
    
        // Find address Loop
        // for(let i = 0; i < receipt.logs.length; i++){
        //     if(receipt.logs[i].topics[0] == sha3("Approval(address,address,uint256)")){
        //         tokenAddress = receipt.logs[i].address.toLowerCase();
        //         break;
        //     }
        // }       
    
        // if(tokenAddress == ""){ 
        //     let otherTxn: IOtherTxnData = { txn_hash: txnHash, token_address: null }
        //     return (otherTxn);
        // }
        
        for(let i = 0; i < receipt.logs.length; i++){
            let log = receipt.logs[i];            
            if(log.topics[0] == sha3("Transfer(address,address,uint256)")){
                // Find Token ID's Loop
                if(log.address.toLowerCase() == tokenAddress){
                    tokenIdArray.push(hexToNumberString(log.topics[3]));
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

        blockData = await web3.eth.getBlock(txnData.blockNumber);
        timestamp = blockData.timestamp.toString(); 
        value = parseFloat(fromWei(txnData.value));
    
        let txn: ITxnData = 
        {
            txn_timestamp: timestamp,
            block_number: txnData.blockNumber,
            txn_hash: txnHash, 
            token_address: tokenAddress,
            token_id: tokenIdArray,
            value            
        }
        
        return (txn);
    }
    
    static async getLastBlockOnChain(web3: Web3): Promise<number> {
        const blockNumber = await web3.eth.getBlockNumber();
        return blockNumber;
    }
}

interface ITxnData {
    txn_timestamp: string;
    block_number: number;
    txn_hash: string;
    token_address: string;    
    token_id: string[];
    value: number;
}

interface IOtherTxnData {
    txn_hash: string;
    token_address: null;
}

export { Web3MiscMethods }

