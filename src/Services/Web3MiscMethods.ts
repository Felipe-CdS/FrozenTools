import Web3 from "web3"
import {  fromWei, sha3, hexToNumberString } from "web3-utils";
import { Transaction, TransactionReceipt } from "web3-eth"
import { Log } from "web3-core";
import { ITxnData } from "../Interfaces/ITxnData"
import { IOtherTxnData } from "../Interfaces/IOtherTxnData"

class Web3MiscMethods{

    static async getSingleTxnData(web3: Web3, txn_hash: string){

        let txnData: Transaction = null; 
        let receipt: TransactionReceipt = null;
        let txn: ITxnData = 
            {
                txn_hash,
                timestamp: null,
                block_number: null,            
                token_address: null,    
                token_id_array: null,
                value: null,
            };
        
        txnData             = await web3.eth.getTransaction(txn_hash);
        receipt             = await web3.eth.getTransactionReceipt(txn_hash); 
        
        txn.txn_hash        = txn_hash;
        txn.block_number    = txnData.blockNumber;
        txn.token_address   = this.findContractAdress(txnData.input, receipt.logs);
        txn.token_id_array  = this.findTokenIDs(txn.token_address, receipt.logs);        

        if(!txn.token_id_array[0]){ 
            let otherTxn: IOtherTxnData = { txn_hash, token_address: null };
            return (otherTxn);
        }
        
        txn.timestamp      = await web3.eth.getBlock(txnData.blockNumber).then((x) =>{ return x.timestamp.toString() });
        txn.value          = this.getTxnValue(txn.token_address, receipt.logs, txnData);    

        return (txn);
    }

    private static findContractAdress(txnInput: string, receiptLog: Log[]) {
        let contractAddress: string = null;

        for(let i = 0; i < receiptLog.length; i++){
            if(receiptLog[i].topics[0] == sha3("Approval(address,address,uint256)")){
                contractAddress = receiptLog[i].address.toLowerCase();
                break;
            }
        }

        if(contractAddress == null)
            contractAddress = "0x" + txnInput.slice(290,330).toLowerCase();

        return contractAddress;
    }

    private static findTokenIDs(contractAddress: string, receiptLog: Log[]) {
        let tokenIdArray: string[] = [];

        for(let i = 0; i < receiptLog.length; i++){
            if(receiptLog[i].topics[0] == sha3("Transfer(address,address,uint256)")){
                if(receiptLog[i].address.toLowerCase() == contractAddress)
                    tokenIdArray.push(hexToNumberString(receiptLog[i].topics[3]));
            }
        }

        return tokenIdArray;
    }

    private static getTxnValue(contractAddress: string, receiptLog: Log[], txnData: Transaction) {
        let value: number = null;

        // Find value on bid auctions
        for(let i = 0; i < receiptLog.length; i++){
            if(receiptLog[i].topics[0] == sha3("Transfer(address,address,uint256)")){
                if(receiptLog[i].address.toLowerCase() != contractAddress){                    
                    value = Math.max(value, parseFloat(fromWei(receiptLog[i].data)));
                }                   
            }
        }

        if(!value)
            value = parseFloat(fromWei(txnData.value)); // Find value on regular transactions

        return value;
    }
    
    static async getLastBlockOnChain(web3: Web3): Promise<number> {
        const blockNumber = await web3.eth.getBlockNumber();
        return blockNumber;
    }
}

export { Web3MiscMethods }

