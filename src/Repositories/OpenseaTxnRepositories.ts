import { EntityRepository, Repository } from "typeorm"
import { OpenseaTxn } from "../Entities/OpenseaTxn"

@EntityRepository(OpenseaTxn)
class OpenseaTxnRepositories extends Repository<OpenseaTxn> { }

export { OpenseaTxnRepositories }