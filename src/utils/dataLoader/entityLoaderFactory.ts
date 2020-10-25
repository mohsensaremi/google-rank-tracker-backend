import {Entity} from "app/entity";
import DataLoader from "dataloader";
import {Repository} from "app/repository";
import {spreadArrayBy} from "utils/array";

export type EntityLoader<U extends Entity> = DataLoader<U['id'] | undefined | null, U | null>

export const entityLoaderFactory = <U extends Entity>(repo: Repository<U>, idField?: string): EntityLoader<U> =>
    new DataLoader(async (keys: readonly (U['id'] | undefined | null)[]) => {
        const items = await repo.find({
            [idField || "_id"]: {$in: keys.filter(x => !!x)}
        })();
        const idField_ = (idField === "id" ? "_id" : idField) || "_id";
        return spreadArrayBy(idField_)(keys, items);
    });
