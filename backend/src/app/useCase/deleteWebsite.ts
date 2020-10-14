import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";
import {ObjectId} from 'mongodb';
import {Website} from "app/entity/Website";
import {MongoDBObjectIDString} from "codec/MongoDBObjectIDString";
import {deleteKeyword} from "app/useCase/deleteKeyword";

export const deleteWebsiteById = (ctx: AppContext) => (id: MongoDBObjectIDString) => pipe(
    ctx.repo.Website.findById(ObjectId.createFromHexString(id)),
    TE.chain(item => TE.rightTask(deleteWebsite(ctx)(item))),
);

export const deleteWebsite = (ctx: AppContext) => (item: Website) => pipe(
    ctx.repo.Keyword.find({
        websiteId: String(item.id),
    }),
    T.chain(keywords => pipe(
        keywords,
        A.map(deleteKeyword(ctx)),
        A.array.sequence(T.taskSeq),
    )),
    T.chain(()=>ctx.repo.Website.deleteOne(item)),
);
