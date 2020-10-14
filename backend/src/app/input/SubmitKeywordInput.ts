import * as t from 'io-ts';
import {partialNullableType} from "utils/codec/partialNullableType";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";

export const SubmitKeywordInputCodec = t.intersection([
    t.type({
        websiteId: MongoDBObjectIDStringCodec,
        title: t.string,
    }),
    partialNullableType({
        id: MongoDBObjectIDStringCodec,
    }),
]);

export type SubmitKeywordInput = t.TypeOf<typeof SubmitKeywordInputCodec>