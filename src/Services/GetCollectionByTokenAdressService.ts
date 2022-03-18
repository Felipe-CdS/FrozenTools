import { getCustomRepository } from "typeorm"
import { TransactionRepositories } from "../Repositories/TransactionRepositories"


class GetCollectionByTokenAdressService {

    async execute(token_address: string){
        const transactionRepository = getCustomRepository(TransactionRepositories);
        const transactions = await transactionRepository.find({ token_address });
        return transactions;
    }
}

export { GetCollectionByTokenAdressService }