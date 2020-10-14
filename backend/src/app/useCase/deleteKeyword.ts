import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";
import {ObjectId} from 'mongodb';
import {Keyword} from "app/entity/Keyword";
import {MongoDBObjectIDString} from "codec/MongoDBObjectIDString";
import {deleteKeywordRank} from "app/useCase/deleteKeywordRank";

export const deleteKeywordById = (ctx: AppContext) => (id: MongoDBObjectIDString) => pipe(
    ctx.repo.Keyword.findById(ObjectId.createFromHexString(id)),
    TE.chain(item => TE.rightTask(deleteKeyword(ctx)(item))),
);

export const deleteKeyword = (ctx: AppContext) => (item: Keyword) => pipe(
    ctx.repo.KeywordRank.find({
        websiteId: String(item.id),
    }),
    T.chain(keywordRanks => pipe(
        keywordRanks,
        A.map(deleteKeywordRank(ctx)),
        A.array.sequence(T.taskSeq),
    )),
    T.chain(()=>ctx.repo.Keyword.deleteOne(item)),
);
