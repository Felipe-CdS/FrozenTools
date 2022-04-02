import { getCustomRepository, LessThan } from "typeorm"
import { TransactionRepositories } from "../Repositories/TransactionRepositories"


class GetCollectionByTokenAdressService {

    async execute(token_address: string){
        const transactionRepository = getCustomRepository(TransactionRepositories);
        const transactions = await transactionRepository.find(
            {
                where: { 
                    token_address,
                    block_timestamp: LessThan("2021-05-01T00:15:48.000Z")
                }
            }            
            );
        return transactions;
    }
}

export { GetCollectionByTokenAdressService }