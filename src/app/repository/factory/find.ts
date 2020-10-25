import {Db} from "mongodb";
import {pipe} from "fp-ts/lib/pipeable";
import {Entity} from "app/entity";

export const findFactory = (db: Db) => (collection: string) => <U extends Entity>(query?: any, options?: any) => pipe(
    async () => {
        const cursor = db.collection(collection).find<U>(query,options);
        const array = await cursor.toArray();
        return array.map(x => {
            (x as any).id = (x as any)._id;
            return x;
        });
    },
);
