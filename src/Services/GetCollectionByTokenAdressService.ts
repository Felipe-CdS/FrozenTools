import { getCustomRepository, LessThan } from "typeorm"
import { TransactionRepositories } from "../Repositories/TransactionRepositories"


class GetCollectionByTokenAdressService {

    async execute(token_address: string){
        const transactionRepository = getCustomRepository(TransactionRepositories);
        const transactions = await transactionRepository.find({ where: { token_address } });
        return transactions;
    }
}

export { GetCollectionByTokenAdressService }