import { EntityRepository, Repository } from "typeorm";
import { OtherTxn } from "../Entities/OtherTxn";

@EntityRepository(OtherTxn)
class OtherTxnRepositories extends Repository<OtherTxn> { }

export { OtherTxnRepositories }