import { EntityRepository, Repository } from "typeorm"
import { Collection, ICollection } from "../Entities/Collection";

@EntityRepository(Collection)
class CollectionRepositories extends Repository<Collection> { 
}

export { CollectionRepositories }