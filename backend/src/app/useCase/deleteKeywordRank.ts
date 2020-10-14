import {pipe} from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import {ObjectId} from 'mongodb';
import {AppContext} from "app/context";
import {MongoDBObjectIDString} from "codec/MongoDBObjectIDString";
import {KeywordRank} from "app/entity/KeywordRank";

export const deleteKeywordRankById = (ctx: AppContext) => (id: MongoDBObjectIDString) => pipe(
    ctx.repo.KeywordRank.findById(ObjectId.createFromHexString(id)),
    TE.chain(item => TE.rightTask(deleteKeywordRank(ctx)(item))),
);

export const deleteKeywordRank = (ctx: AppContext) => (item: KeywordRank) => pipe(
    ctx.repo.KeywordRank.deleteOne(item),
);
