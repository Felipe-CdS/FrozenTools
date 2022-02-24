import { getCustomRepository } from "typeorm";
import { OpenseaTxnRepositories } from "../Repositories/OpenseaTxnRepositories";

class GetAllContractTransactionsService {

    async execute(token_address: string){
        const repository = getCustomRepository(OpenseaTxnRepositories);
        const transactions = await repository.find({where: { token_address }});        
        return transactions;
    }
}


export { GetAllContractTransactionsService }