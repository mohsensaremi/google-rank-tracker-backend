import {Db} from "mongodb";
import {Entity} from "app/entity";
import omit from 'lodash/omit';
import {pipe} from "fp-ts/lib/pipeable";
import * as T from 'fp-ts/lib/Task';

export const updateOneFactory = (db: Db) => (collection: string) => <U extends Entity>(data: U) => pipe(
    () => db.collection(collection).updateOne({
        _id: data.id,
    }, {
        $set: {
            ...omit(data, ['id', '_id'])
        },
    }),
    T.map(() => data),
);
