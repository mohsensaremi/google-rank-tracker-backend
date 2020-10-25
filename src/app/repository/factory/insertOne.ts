import {Db, ObjectId} from "mongodb";
import {Entity} from "app/entity";
import omit from 'lodash/omit';
import {pipe} from "fp-ts/lib/pipeable";
import * as T from 'fp-ts/lib/Task';

export const insertOneFactory = (db: Db) => (collection: string) => <U extends Entity>(data: U) => pipe(
    () => db.collection(collection).insertOne({
        _id: ObjectId.isValid(data.id) ? new ObjectId(data.id) : data.id,
        ...omit(data, ['id', '_id'])
    }),
    T.map(() => data),
);
