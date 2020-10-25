import * as t from 'io-ts';
import {MongoDBObjectIDCodec} from "codec/MongoDBObjectID";

export const WebsiteCodec = t.type({
    id: MongoDBObjectIDCodec,
    website: t.string,
}, 'Website');

export type Website = t.TypeOf<typeof WebsiteCodec>