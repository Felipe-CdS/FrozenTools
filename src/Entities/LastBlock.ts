import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity("lastblock")
class LastBlock {

    @PrimaryColumn()
    block_number: number;

}

export { LastBlock }