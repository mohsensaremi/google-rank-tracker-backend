import * as t from 'io-ts';
import {MongoDBObjectIDCodec} from "codec/MongoDBObjectID";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";

export const KeywordCodec = t.type({
    id: MongoDBObjectIDCodec,
    websiteId: MongoDBObjectIDStringCodec,
    title: t.string,
}, 'Keyword');

export type Keyword = t.TypeOf<typeof KeywordCodec>