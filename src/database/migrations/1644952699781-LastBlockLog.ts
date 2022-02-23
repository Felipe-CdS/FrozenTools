import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { LastBlockLogRepositories } from "../../Repositories/LastBlockLogRepositories";

export class LastBlockLog1644952699781 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable( 
            new Table({
                name: "lastblock",
                columns: [
                    {
                        name: "block_number",
                        type: "bigint"
                    }
                ]
            })
        );

        //Seed Block -> Open sea deploy
        const openseaTxnRepository = queryRunner.manager.getCustomRepository(LastBlockLogRepositories);
        await openseaTxnRepository.insert([
            {  
                // block_number: 5774644
                block_number: 14135713 // Testing block
            }
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("lastblock");
    }
}
