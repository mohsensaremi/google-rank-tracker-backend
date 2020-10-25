import * as t from 'io-ts';
import {DatatableInputCodec} from "app/repository/datatable";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";

export const GetKeywordRankDatatableInputCodec = t.intersection([
    DatatableInputCodec,
    t.type({
        keywordId: MongoDBObjectIDStringCodec,
    }),
]);

export type GetKeywordRankDatatableInput = t.TypeOf<typeof GetKeywordRankDatatableInputCodec>