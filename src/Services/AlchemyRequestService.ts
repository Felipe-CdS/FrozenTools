import Web3 from "web3";
import { AbiItem, hexToNumberString, fromWei, toHex } from "web3-utils";
import { abi_ } from "../Abi/abi";

interface ITxnData {
    timestamp: string;
    blockNumber: number;
    hash: string;
    tokenAddress: string;    
    tokenId: string;
    value: string;    
}

class AlchemyRequestService {   
    
    async getTxnData(txnHash: string, web3: Web3){

        let txnData = await web3.eth.getTransaction(txnHash);
        let receipt = await web3.eth.getTransactionReceipt(txnHash);
        let blockData = await web3.eth.getBlock(txnData.blockNumber);

        let tokenAddress = "0x" + txnData.input.slice(290,330); //hexToNumberString(receipt.logs[0].address); // NOT DONE
        let tokenId = hexToNumberString(receipt.logs[0].topics[3]);
        let value = fromWei(txnData.value);
        let timestamp = blockData.timestamp.toString();

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

    async web3SingleBlockReq(apiString: string, contractAddress: string, blockNumber: string){

        const web3 = new Web3(Web3.givenProvider || apiString);
        const contract = new web3.eth.Contract(abi_ as AbiItem[], contractAddress);

        if(blockNumber != "latest")
            blockNumber = toHex(blockNumber);

        const response = await contract.getPastEvents("OrdersMatched", { "fromBlock": blockNumber, "toBlock": blockNumber });
        
        const hashArray = response.map(obj => { return obj.transactionHash });

        const dataArray = [];

        for(let i = 0; i < hashArray.length; ++i){
            let txn = await this.getTxnData(hashArray[i], web3);
            dataArray.push(txn);
        }
        
        return {"Total:": hashArray.length, dataArray};
    }

    async execute(contractAddress: string, blockNumber: string){        
        const apiString = process.env.ALCHEMY_API_STRING;
        const response = await this.web3SingleBlockReq(apiString, contractAddress, blockNumber);
        return response;
    }
}

export { AlchemyRequestService }