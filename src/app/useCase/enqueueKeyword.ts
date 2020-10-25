import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as E from "fp-ts/Either";
import {ObjectId} from 'mongodb';
import {KeywordCodec} from "app/entity/Keyword";
import {decodeCodec} from "utils/codec/decodeCodec";
import {KeywordRankCodec} from "app/entity/KeywordRank";
import {ApplicationError, ApplicationErrorKind} from "Error/ApplicationError";

export const enqueueKeyword = (ctx: AppContext) => (id: string) => pipe(
    ctx.repo.Keyword.findById(ObjectId.createFromHexString(id)),
    TE.chain(x => TE.fromEither(decodeCodec(KeywordCodec.decode(x)))),
    TE.chain(keyword => pipe(
        ctx.repo.KeywordRank.findOne({
            keywordId: String(keyword.id),
            state: "pending",
        }),
        TE.fold(
            () => TE.right(keyword),
            (keywordRank) => TE.left(new ApplicationError({
                kind: ApplicationErrorKind.PendingKeywordRankAlreadyExists,
                keyword,
                keywordRank,
            }))
        ),
    )),
    TE.chain(keyword => pipe(
        ({
            id: new ObjectId(),
            keywordId: String(keyword.id),
            rank: -1,
            isLast: false,
            state: "pending",
            error: null,
            createdAt: new Date(),
        }),
        (x => decodeCodec(KeywordRankCodec.decode(x))),
        E.map(keywordRank => pipe(
            keywordRank,
            KeywordRankCodec.encode,
            ctx.repo.KeywordRank.insertOne,
        )),
        E.either.sequence(T.task),
    )),
    TE.map(keywordRank => {
        const queue = 'keywordRank';
        const msg = JSON.stringify(KeywordRankCodec.encode(keywordRank));

        ctx.mqChannel.assertQueue(queue, {
            durable: true
        });
        ctx.mqChannel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        return keywordRank;
    }),
);
