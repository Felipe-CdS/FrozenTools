import { EntityRepository, Repository } from "typeorm";
import { OtherTxn } from "../Entities/OtherTxn";
import { IOtherTxnData } from "../Interfaces/IOtherTxnData"

@EntityRepository(OtherTxn)
class OtherTxnRepositories extends Repository<OtherTxn> {

    async saveOtherTxnOnDB(txn: IOtherTxnData){
        const { txn_hash } = txn;
        const txn_entity = this.create({ id: txn_hash });
        await this.save(txn_entity);
        return txn_entity;
    }
}

export { OtherTxnRepositories }