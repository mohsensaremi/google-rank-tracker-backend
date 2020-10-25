import * as t from 'io-ts';
import {MongoDBObjectIDCodec} from "codec/MongoDBObjectID";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";
import {partialNullableType} from "utils/codec/partialNullableType";

export const KeywordCodec = t.intersection([
    t.type({
        id: MongoDBObjectIDCodec,
        websiteId: MongoDBObjectIDStringCodec,
        title: t.string,
        platform: t.union([
            t.literal('desktop'),
            t.literal('mobile'),
        ]),
    }),
    partialNullableType({
        lastRank: t.number,
        lastRank2: t.number,
        category: t.string,
    }),
], 'Keyword');

export type Keyword = t.TypeOf<typeof KeywordCodec>