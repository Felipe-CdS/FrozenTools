import Web3 from "web3"
import axios from "axios";
import {  fromWei, sha3, hexToNumberString } from "web3-utils";
import { Transaction, TransactionReceipt } from "web3-eth"
import { Log } from "web3-core";
import { ITxnData } from "../Interfaces/ITxnData"
import { IOtherTxnData } from "../Interfaces/IOtherTxnData"
import { getCustomRepository, Not } from "typeorm";
import { OpenseaTxnRepositories } from "../Repositories/OpenseaTxnRepositories";



class Web3MiscMethods{

    static async getSingleTxnData(web3: Web3, txn_hash: string){

        let txnData: Transaction = null; 
        let receipt: TransactionReceipt = null;
        let txn: ITxnData = 
            {
                txn_hash,
                block_number: null,            
                token_address: null,    
                token_id_array: null,
                value: null,
                date: null
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
        
        txn.date           = new Date();
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

    // ATTENTION:
    // This isn't a production method. However it can be useful in the future for debugging. 
    // It is just used to update false 0 value txns saved before the getTxnValue() implementation.
    // Even after this, there are still some 0 value txns. Maybe nft gifts (?)
    static async findAndFixAllZeroValueTxn(web3: Web3){
        const openseaTxnRepository = getCustomRepository(OpenseaTxnRepositories);
        const zeroTxns = await openseaTxnRepository.find({ value: 0 });

        for(let i = 0; i < zeroTxns.length; i++){

            let txnData  = await web3.eth.getTransaction(zeroTxns[i].id);
            let receipt  = await web3.eth.getTransactionReceipt(zeroTxns[i].id);
            let newValue = Web3MiscMethods.getTxnValue(zeroTxns[i].token_address, receipt.logs, txnData);

            await openseaTxnRepository.update(zeroTxns[i].id, { value: newValue });
           
            if(newValue == 0){
                console.log(i, "/", zeroTxns.length, "||", zeroTxns[i].id + " still value 0");
            }
            else{
                console.log(i, "/", zeroTxns.length, "||", "new value: ", newValue);
            }
        }
    }
}

export { Web3MiscMethods }

