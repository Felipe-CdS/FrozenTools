import axios from "axios"

class GetBasicETHInfoService {

	async execute(){
		let api_string, eth_price, block_number, gas_price: string;

		api_string = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
        let response = await axios.get(api_string).then((resp) => resp.data);
		eth_price = response.USD;

		api_string = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + process.env.ETHERSCAN_API_KEY;
		response = await axios.get(api_string).then((resp) => resp.data);
		block_number = response.result.LastBlock;
		gas_price = response.result.SafeGasPrice;
		
		return({eth_price, block_number, gas_price});
	}
}

export { GetBasicETHInfoService }