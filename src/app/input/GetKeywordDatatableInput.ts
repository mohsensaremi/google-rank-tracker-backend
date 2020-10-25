import * as t from 'io-ts';
import {DatatableInputCodec} from "app/repository/datatable";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";
import {partialNullableType} from "utils/codec/partialNullableType";

export const GetKeywordDatatableInputCodec = t.intersection([
    DatatableInputCodec,
    t.type({
        websiteId: MongoDBObjectIDStringCodec,
    }),
    partialNullableType({
        category: t.string,
    })
]);

export type GetKeywordDatatableInput = t.TypeOf<typeof GetKeywordDatatableInputCodec>