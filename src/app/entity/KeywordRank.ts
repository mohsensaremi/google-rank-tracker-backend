import * as t from 'io-ts';
import {MongoDBObjectIDCodec} from "codec/MongoDBObjectID";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";
import {nullableCodec} from "utils/codec/nullableCodec";
import {DateCodec} from "codec/DateCodec";

export const KeywordRankCodec = t.type({
    id: MongoDBObjectIDCodec,
    keywordId: MongoDBObjectIDStringCodec,
    rank: t.number,
    isLast: t.boolean,
    state: t.union([
        t.literal("pending"),
        t.literal("done"),
        t.literal("error"),
    ]),
    error: nullableCodec(t.unknown),
    createdAt: DateCodec,
}, 'keywordRank');

export type KeywordRank = t.TypeOf<typeof KeywordRankCodec>