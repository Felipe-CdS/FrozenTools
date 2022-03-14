import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { getCustomRepository } from "typeorm";
import { OpenseaTxn } from "../../Entities/OpenseaTxn";
import { OpenseaTxnRepositories } from "../../Repositories/OpenseaTxnRepositories";

export class OpenseaTxnDates1647189733771 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("openseatxn", new TableColumn({
            name: "date",
            type: "timestamp",
            default: "now()"
        }));

        const zeroTxns = await queryRunner.manager.query('SELECT * FROM openseatxn');

        for(let i = 0; i < zeroTxns.length; i++){
            let timestamp = parseInt(zeroTxns[i].txn_timestamp);
            let newDate = new Date(timestamp * 1000);

            await queryRunner.manager.createQueryBuilder()
                .update(OpenseaTxn)
                .set({ date: newDate })
                .where("id = :id", { id: zeroTxns[i].id })
                .execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("openseatxn", "date");
    }

}
