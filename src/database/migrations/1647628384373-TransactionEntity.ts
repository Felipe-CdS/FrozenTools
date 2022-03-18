import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class TransactionEntity1647628384373 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "transactions",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "transaction_hash",
                    type: "varchar"
                },
                {
                    name: "transaction_index",
                    type: "integer"
                },
                {
                    name: "token_ids",
                    type: "text",
                    isArray: true
                },
                {
                    name: "seller_address",
                    type: "varchar"
                },
                {
                    name: "buyer_address",
                    type: "varchar"
                },
                {
                    name: "token_address",
                    type: "varchar"
                },
                {
                    name: "marketplace_address",
                    type: "varchar"
                },
                {
                    name: "price",
                    type: "varchar"
                },
                {
                    name: "block_timestamp",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "block_number",
                    type: "integer"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "symbol",
                    type: "varchar",
                    isNullable: true
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("transactions");
    }

}
