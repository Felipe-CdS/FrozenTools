import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { getCustomRepository } from "typeorm";
import { OpenseaTxn } from "../../Entities/OpenseaTxn";
import { OpenseaTxnRepositories } from "../../Repositories/OpenseaTxnRepositories";

export class OpenseaTxnDates1647189733771 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("openseatxn", "txn_timestamp");
        await queryRunner.addColumn("openseatxn", new TableColumn({
            name: "date",
            type: "timestamp",
            default: "now()"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("openseatxn", "date");
    }

}
