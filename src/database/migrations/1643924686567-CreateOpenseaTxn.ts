import {MigrationInterface, QueryRunner, Table, getConnection} from "typeorm";
import { OpenseaTxn } from "../../Entities/OpenseaTxn";
import { v4 as uuid } from "uuid";

export class CreateOpenseaTxn1643924686567 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "openseatxn",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "txn_timestamp",
                        type: "varchar"
                    },
                    {
                        name: "block_number",
                        type: "bigint"
                    },
                    {
                        name: "txn_hash",
                        type: "varchar"
                    },
                    {
                        name: "token_address",
                        type: "varchar"
                    },
                    {
                        name: "token_id",
                        type: "varchar"
                    },
                    {
                        name: "value",
                        type: "real"
                    }
                ]
            })
        )
        
        await getConnection().createQueryBuilder().insert().into(OpenseaTxn).values(
            [
                {  
                    id: uuid(),
                    txn_timestamp: "",
                    block_number: 5774644,
                    txn_hash: "",
                    token_address: "",
                    token_id: "",
                    value: 0
                }
            ]
        ).execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("openseatxn");
    }

}
