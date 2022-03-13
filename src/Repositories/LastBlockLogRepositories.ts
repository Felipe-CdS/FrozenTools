import { EntityRepository, Repository } from "typeorm";
import { LastBlock } from "../Entities/LastBlock";

@EntityRepository(LastBlock)
class LastBlockLogRepositories extends Repository<LastBlock> {

    async getLastBlockOnDB(): Promise<number> { 
        const { block_number } = await this.findOne({ order: { block_number: "DESC" } });
        return Number(block_number);
    }

    async setLastBlockOnDB(newBlock: number): Promise<LastBlock> {
        const blockOnDB = await this.findOne({ order: { block_number: "DESC" } });
        await this.update({ block_number: blockOnDB.block_number }, { block_number: newBlock });
        return blockOnDB;
    }

 }

export { LastBlockLogRepositories }