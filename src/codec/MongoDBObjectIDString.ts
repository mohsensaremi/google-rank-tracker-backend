import * as t from 'io-ts';
import {isObjectId} from "utils/mongodb";

const inputIsObjectId = (input: unknown): input is string => isObjectId(input);

export const MongoDBObjectIDStringCodec = new t.Type<string, string, unknown>(
    'MongoDBObjectIDString',
    inputIsObjectId,
    (input, context) => (isObjectId(input)
        ? t.success(String(input))
        : t.failure(input, context)),
    t.identity,
);

export type MongoDBObjectIDString = t.OutputOf<typeof MongoDBObjectIDStringCodec>
