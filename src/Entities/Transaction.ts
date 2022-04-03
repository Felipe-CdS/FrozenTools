import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("transactions")
class Transaction {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    transaction_hash: string; 

    @Column()
    transaction_index: number; 

    @Column("text", { array: true })
    token_ids: string[];

    @Column()
    seller_address: string;

    @Column()
    buyer_address: string;

    @Column()
    token_address: string;

    @Column()
    marketplace_address: string;

    @Column()
    price: string;

    @Column()
    block_timestamp: Date;

    @Column()
    block_number: number; 

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

interface Itransaction {
    transaction_hash: string;
    transaction_index: number;
    token_ids: string[];
    seller_address: string;
    buyer_address: string;
    token_address: string;
    marketplace_address: string;
    price: string;
    block_timestamp: Date;
    block_number: number;
}

export { Transaction, Itransaction }