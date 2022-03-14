import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";



@Entity("openseatxn")
class OpenseaTxn {

    @PrimaryColumn()
    id: string; // ID => txn_hash

    @Column()
    txn_timestamp: string;

    @Column()
    date: Date;

    @Column()
    block_number: number;   

    @Column()
    token_address: string;

    @Column("text", { array: true })
    token_id: string[];

    @Column()
    value: number;

}

export { OpenseaTxn }