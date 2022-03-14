import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class OpenseaTxnName1647284667798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("openseatxn", new TableColumn({
            name: "name",
            type: "varchar",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("openseatxn", "name");
    }

}
