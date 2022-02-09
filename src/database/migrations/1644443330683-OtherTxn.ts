import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class OtherTxn1644443330683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
            {
                name: "othertxn",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name:"txn_hash",
                        type: "varchar"
                    }
                ]
            }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("othertxn");
    }

}
