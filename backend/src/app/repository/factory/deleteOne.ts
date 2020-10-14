import {Db} from "mongodb";
import {pipe} from "fp-ts/lib/pipeable";
import * as T from 'fp-ts/lib/Task';
import {Entity} from "app/entity";

export const deleteOneFactory = (db: Db) => (collection: string) => <U extends Entity>(data: U) => pipe(
    () => db.collection(collection).deleteOne({
        _id: data.id,
    }),
    T.map(() => data),
);
