import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import {ApplicationError, ApplicationErrorKind} from "Error/ApplicationError";
import {KeywordCodec} from "app/entity/Keyword";
import {decodeCodec} from "utils/codec/decodeCodec";
import {getKeywordRank} from "app/useCase/getKeywordRank";
import {ObjectId} from 'mongodb';
import {WebsiteCodec} from "app/entity/Website";
import {sleep} from "utils/time";
import {KeywordRankCodec} from "app/entity/KeywordRank";
import {getSettings} from "app/useCase/getSettings";

export const keywordRankQueueFactory = (ctx: AppContext) => {
    const queue = 'keywordRank';

    ctx.mqChannel.assertQueue(queue, {
        durable: true
    });

    ctx.mqChannel.prefetch(1);
    ctx.mqChannel.consume(queue, async function (msg) {
        if (msg) {
            await pipe(
                msg.content.toString(),
                (json => E.tryCatch(
                    () => JSON.parse(json),
                    () => new ApplicationError({
                        kind: ApplicationErrorKind.Unknown,
                        data: "json parse error"
                    })
                )),
                E.chain(x => decodeCodec(KeywordRankCodec.decode(x))),
                TE.fromEither,
                TE.chain(keywordRank => TE.rightTask(pipe(
                    ctx.repo.Keyword.findById(ObjectId.createFromHexString(keywordRank.keywordId)),
                    TE.chain(x => TE.fromEither(decodeCodec(KeywordCodec.decode(x)))),
                    TE.chain(keyword => pipe(
                        ctx.repo.Website.findById(ObjectId.createFromHexString(keyword.websiteId)),
                        TE.chain(x => TE.fromEither(decodeCodec(WebsiteCodec.decode(x)))),
                        TE.map(website => ({
                            keyword,
                            website,
                            keywordRank,
                        })),
                    )),
                    TE.chain(({keyword, website, keywordRank}) => pipe(
                        TE.tryCatch(
                            async () => await getKeywordRank({
                                maxPage: 10
                            })(website.website)(keyword.title),
                            (error: any) => new ApplicationError({
                                kind: ApplicationErrorKind.GetRank,
                                data: error,
                            })
                        ),
                        TE.chain(rank => TE.rightTask(pipe(
                            ctx.repo.KeywordRank.findOne({
                                isLast: true,
                            }),
                            TE.chain(x => TE.fromEither(decodeCodec(KeywordRankCodec.decode(x)))),
                            TE.chain(x => TE.rightTask(pipe(
                                ({
                                    ...x,
                                    isLast: false,
                                }),
                                KeywordRankCodec.encode,
                                ctx.repo.KeywordRank.updateOne,
                            ))),
                            TE.fold(
                                () => T.of(keywordRank),
                                () => T.of(keywordRank),
                            ),
                            T.chain(keywordRank => pipe(
                                ({
                                    ...keywordRank,
                                    rank: rank ? rank : 0,
                                    state: "done",
                                    isLast: true,
                                }),
                                KeywordRankCodec.encode,
                                ctx.repo.KeywordRank.updateOne,
                            ))
                        ))),
                    )),
                    TE.map(x => {
                        ctx.socketIO.emit("keywordRankProcessDone", x);
                        return x;
                    }),
                    TE.fold(
                        (left) => pipe(
                            ({
                                ...keywordRank,
                                rank: 0,
                                state: "error",
                                error: left,
                            }),
                            KeywordRankCodec.encode,
                            ctx.repo.KeywordRank.updateOne,
                        ),
                        T.of
                    ))
                )),
            )();

            const seconds = pipe(
                getSettings(),
                E.fold(
                    () => 60,
                    x => x.browserSearchSleepSeconds,
                ),
            );

            await sleep(seconds);

            ctx.mqChannel.ack(msg);
        }
    }, {
        noAck: false
    });
}