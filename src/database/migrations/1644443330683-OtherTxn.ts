import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class OtherTxn1644443330683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
            {
                name: "othertxn",
                columns: [
                    {
                        name:"id",
                        type: "varchar",
                        isPrimary: true
                    }
                ]
            }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("othertxn");
    }

}
