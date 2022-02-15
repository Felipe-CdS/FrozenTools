import { EntityRepository, Repository } from "typeorm";
import { OtherTxn } from "../Entities/OtherTxn";

@EntityRepository(OtherTxn)
class OtherTxnRepositories extends Repository<OtherTxn> {

    async saveOtherTxnOnDB(txn: IOtherTxnData){
        const { txn_hash } = txn;
        const txn_entity = this.create({ txn_hash });
        await this.save(txn_entity);
        return txn_entity;
    }
}

interface IOtherTxnData {
    txn_hash: string;
    token_address: null;
}

export { OtherTxnRepositories }