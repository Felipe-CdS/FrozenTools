import {MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOpenseaTxn1643924686567 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "openseatxn",
                columns: [
                    {
                        name:"id",
                        type: "varchar",
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
                        name: "token_address",
                        type: "varchar"
                    },
                    {
                        name: "token_id",
                        type: "text",
                        isArray: true
                    },
                    {
                        name: "value",
                        type: "real"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("openseatxn");
    }

}
