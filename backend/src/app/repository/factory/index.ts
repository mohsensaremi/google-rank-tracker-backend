import {Db} from "mongodb";
import {insertOneFactory} from "./insertOne";
import {datatableFactory} from "./datatable";
import {Entity} from "app/entity";
import {findFactory} from "./find";
import {findByIdFactory} from "./findById";
import {updateOneFactory} from "./updateOne";
import {findOneFactory} from "./findOne";
import {deleteOneFactory} from "./deleteOne";
import {findCountFactory} from "./findCount";
import {Repository} from "app/repository/index";

export const repositoryFactory = <U extends Entity>(db: Db) => (collection: string): Repository<U> => ({
    insertOne: insertOneFactory(db)(collection),
    updateOne: updateOneFactory(db)(collection),
    deleteOne: deleteOneFactory(db)(collection),
    find: findFactory(db)(collection),
    findCount: findCountFactory(db)(collection),
    findById: findByIdFactory(db)(collection),
    findOne: findOneFactory(db)(collection),
    datatable: datatableFactory(db)(collection),
});
