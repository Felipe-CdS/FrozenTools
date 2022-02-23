import { Column, Entity, PrimaryColumn } from "typeorm";
import {v4 as uuid } from "uuid";

/*
 * This entity/class is created to store Txns that aren't 
 * ERC-721 tokens like ERC-1155 so these txns can be handled
 * in the future. 
 * 
 */
@Entity("othertxn")
class OtherTxn {
    
    @PrimaryColumn()
    id: string; // ID => txn_hash
}

export { OtherTxn }