import { EntityRepository, Repository } from "typeorm";
import { LastBlock } from "../Entities/LastBlock";

@EntityRepository(LastBlock)
class LastBlockLogRepositories extends Repository<LastBlock> {

    async getLastBlockOnDB(): Promise<number> { 
        const { block_number } = await this.findOne({ order: { block_number: "DESC" } });
        return Number(block_number);
    }

    async setLastBlockOnDB(block_number: number): Promise<LastBlock> {
        const newBlock = this.create({ block_number });
        await this.save(newBlock);
        return newBlock;
    }

 }

export { LastBlockLogRepositories }