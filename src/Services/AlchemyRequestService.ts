import Web3 from "web3";
import { AbiItem, hexToNumberString, fromWei } from "web3-utils";
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

        let tokenAddress = hexToNumberString(receipt.logs[0].address); // NOT DONE
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

    async web3Req(apiString: string, contractAddress: string){

        const web3 = new Web3(Web3.givenProvider || apiString);
        const contract = new web3.eth.Contract(abi_ as AbiItem[], contractAddress);

        const response = await contract.getPastEvents("OrdersMatched", 
            {
                "fromBlock": "latest",
                "toBlock": "latest"
            }
        );

        const hashArray = response.map(obj => {
            return obj.transactionHash;
        });

        const dataArray = [];        

        for(let i = 0; i < hashArray.length; ++i){
            let txn = await this.getTxnData(hashArray[i], web3);
            dataArray.push(txn);
        }
        
        return {"Total:": hashArray.length, dataArray};
    }

    async execute(){        
        const apiString = process.env.ALCHEMY_API_STRING;
        console.log(apiString);
        const contractAddress = "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b";
        const response = await this.web3Req(apiString, contractAddress);
        return response;
    }
}

export { AlchemyRequestService }