import { getCustomRepository, ILike } from "typeorm";
import { Collection } from "../Entities/Collection";
import { CollectionRepositories } from "../Repositories/CollectionRepositories";

class GetCollectionInfoService {

	async execute(entry: string){
        const repository = getCustomRepository(CollectionRepositories);
		let collections: Collection = null;

		if(entry){
			collections = await repository.findOne({token_address: ILike(entry)});
			if(collections)
				return collections;

			collections = await repository.findOne({name: ILike(entry)});
			if(collections)
				return collections;
		}     
    }

}

export  { GetCollectionInfoService }