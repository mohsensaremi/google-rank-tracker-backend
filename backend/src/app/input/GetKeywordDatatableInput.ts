import * as t from 'io-ts';
import {DatatableInputCodec} from "app/repository/datatable";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";

export const GetKeywordDatatableInputCodec = t.intersection([
    DatatableInputCodec,
    t.type({
        websiteId: MongoDBObjectIDStringCodec,
    }),
]);

export type GetKeywordDatatableInput = t.TypeOf<typeof GetKeywordDatatableInputCodec>