import {Db} from "mongodb";
import {Entity} from "app/entity";
import {pipe} from "fp-ts/lib/pipeable";
import * as E from 'fp-ts/lib/Either';

export const findOneFactory = (db: Db) => (collection: string) => <U extends Entity>(query: any) => pipe(
    async () => {
        const record = await db.collection(collection).findOne<U>(query);
        if (record) {
            (record as any).id = (record as any)._id;
        }

        return record ? E.right(record) : E.left("not found");
    },
);
