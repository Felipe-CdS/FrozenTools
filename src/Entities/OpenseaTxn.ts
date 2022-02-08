import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("openseatxn")
class OpenseaTxn {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    txn_timestamp: string;

    @Column()
    block_number: number;

    @Column()
    txn_hash: string;

    @Column()
    token_address: string;

    @Column()
    token_id: string;

    @Column()
    value: string;

    constructor(){
        if(!this.id)
            this.id = uuid();
    }
}

export { OpenseaTxn }