import * as t from 'io-ts';
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";

export const GetKeywordCategoriesInputCodec = t.type({
    websiteId: MongoDBObjectIDStringCodec,
});

export type GetKeywordCategoriesInput = t.TypeOf<typeof GetKeywordCategoriesInputCodec>