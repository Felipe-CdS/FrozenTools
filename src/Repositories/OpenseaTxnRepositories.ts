import { EntityRepository, Repository } from "typeorm"
import { OpenseaTxn } from "../Entities/OpenseaTxn"

@EntityRepository(OpenseaTxn)
class OpenseaTxnRepositories extends Repository<OpenseaTxn> { 

    async saveOpenSeaTxnOnDB(txn: ITxnData){
        const { txn_timestamp, block_number, txn_hash, token_address, token_id, value } = txn;
        const txn_entity = this.create({ id: txn_hash, txn_timestamp, block_number, token_address, token_id, value });
        
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

interface ITxnData {
    txn_timestamp: string;
    block_number: number;
    txn_hash: string;
    token_address: string;    
    token_id: string[];
    value: number;
}

export { OpenseaTxnRepositories }