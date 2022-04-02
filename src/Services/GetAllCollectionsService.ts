import { getCustomRepository } from "typeorm"
import { CollectionRepositories } from "../Repositories/CollectionRepositories";
import { TransactionRepositories } from "../Repositories/TransactionRepositories"


class GetAllCollectionsService {

    async execute(){
        const repository = getCustomRepository(CollectionRepositories);
        const collections = await repository.find();
        return collections;
    }
}

export { GetAllCollectionsService }