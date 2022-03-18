import { EntityRepository, Repository } from "typeorm"
import { Transaction, Itransaction } from "../Entities/Transaction";

@EntityRepository(Transaction)
class TransactionRepositories extends Repository<Transaction> { 

    async saveTransactionOnDB(txn: Itransaction){
        const txn_entity = this.create(txn);

        try{           
            await this.save(txn_entity);
            return txn_entity;
        }
        catch(err){
            console.log(txn_entity);
            throw new Error(err);
        }        
    }    
}

export { TransactionRepositories }