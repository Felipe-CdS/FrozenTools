import { getCustomRepository } from "typeorm"
import axios from "axios";
import { TransactionRepositories } from "../Repositories/TransactionRepositories"


class GetAllCollectionsService {

    async execute(){
        const transactionRepository = getCustomRepository(TransactionRepositories);
        const transactions = await transactionRepository.find();

        return transactions;
    }
}

export { GetAllCollectionsService }