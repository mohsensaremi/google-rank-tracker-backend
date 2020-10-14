import {Db} from "mongodb";
import {Entity} from "app/entity";
import {pipe} from "fp-ts/lib/pipeable";

export const findCountFactory = (db: Db) => (collection: string) => <U extends Entity>(query?: any, options?: any) => pipe(
    async () => {
        return await db.collection(collection).find<U>(query,options).count();
    },
);
