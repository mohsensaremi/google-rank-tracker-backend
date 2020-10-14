import * as t from 'io-ts';
import {ObjectId} from 'mongodb';
import {isObjectId} from "utils/mongodb";

const inputIsObjectId = (input: unknown): input is ObjectId => isObjectId(input);

export const MongoDBObjectIDCodec = new t.Type<ObjectId, ObjectId, unknown>(
    'MongoDBObjectID',
    inputIsObjectId,
    (input, context) => (isObjectId(input)
        ? t.success(ObjectId.createFromHexString(String(input)))
        : t.failure(input, context)),
    t.identity,
);

export type MongoDBObjectID = t.OutputOf<typeof MongoDBObjectIDCodec>
