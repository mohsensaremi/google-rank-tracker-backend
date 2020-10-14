import * as t from 'io-ts';
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";

export const GetKeywordRankGraphInputCodec = t.type({
    keywordId: MongoDBObjectIDStringCodec,
});

export type GetKeywordRankGraphInput = t.TypeOf<typeof GetKeywordRankGraphInputCodec>