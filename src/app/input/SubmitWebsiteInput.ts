import * as t from 'io-ts';
import {partialNullableType} from "utils/codec/partialNullableType";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";

export const SubmitWebsiteInputCodec = t.intersection([
    t.type({
        website: t.string,
    }),
    partialNullableType({
        id: MongoDBObjectIDStringCodec,
    }),
]);

export type SubmitWebsiteInput = t.TypeOf<typeof SubmitWebsiteInputCodec>