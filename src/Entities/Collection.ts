import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("collections")
class Collection {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    token_address: string;

	@Column()
    name: string;

    @Column()
    symbol: string;

	@Column()
    contract_type: string;

	@Column()
	image_url: string;

	@Column()
	twitter_username: string;

	@Column()
	discord_url: string;

	@Column()
	opensea_slug: string;

	@Column()
	total_supply: string;

	@Column()
	holders: number;

	@Column()
	total_volume: number;

	@Column()
	floor_price: number;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

interface ICollection {
    token_address: string;
    name: string;
    symbol: string;
    contract_type: string;
	image_url?: string;
	twitter_username?: string;
	discord_url?: string;
	opensea_slug?: string;
	total_supply?: string;
	holders?: number;
	total_volume?: number;
	floor_price?: number;
}

export { Collection, ICollection }