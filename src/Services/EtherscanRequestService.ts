import axios from "axios"

class EtherscanRequestService {

    async accountTxList(apiString: string, apiKey: string){
        const response = await axios.get(apiString, { params : 
            {
                module: "account",
                action: "txlist",
                address: "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b",
                startblock: "0",
                endblock: "99999999",
                page: 1,
                offset: 100,
                sort: "desc",
                apikey: apiKey
            }
        });

        const data = response.data.result;
        let dataFilter = data.map(obj => {
            let methodHex = obj.input.slice(0,10);
            let tokenAddress = obj.input.slice(256,322);
            // if(tokenAddress == "00000000000000000000000000bc4ca0eda7647a8ab7c2061c2e118a18a936f13d")
            // if(tokenAddress == "0000000000000000000000000000000000baeec315f9d7f8db2645edfd5633360f")
            if(methodHex == "0xab834bab")
                return [obj.hash, obj.blockNumber, obj.value, tokenAddress, methodHex];        
        });

        return dataFilter;
    }

    async getTokenInfo(apiString: string, apiKey: string){
        const response = await axios.get(apiString, { params : 
            {
                module: "stats",
                action: "tokensupply",
                contractaddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
                apikey: apiKey
            }
        });

        return response.data;
    }

    

    async execute(){
        const apiString = "http://api.etherscan.io/api?";
        const apiKey = process.env.ETHERSCAN_API_KEY;

        const response = await this.accountTxList(apiString, apiKey);
        // const response = await this.getTokenInfo(apiString, apiKey);

        return (response);
    }
}

export { EtherscanRequestService }