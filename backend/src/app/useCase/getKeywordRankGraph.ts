import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import {formatKeywordRank} from "app/useCase/formatKeywordRank";
import {GetKeywordRankGraphInput} from "app/input/GetKeywordRankGraphInput";
import {getSettings} from "app/useCase/getSettings";

export const getKeywordRankGraph = (ctx: AppContext) => (input: GetKeywordRankGraphInput) => pipe(
    getSettings(),
    E.map(settings => pipe(
        ctx.repo.KeywordRank.find({
            keywordId: input.keywordId,
            state: "done",
        }, {
            sort: {
                createdAt: 1,
            },
            limit: settings.keywordRankHistoryCount,
        }),
        T.map(items => pipe(
            items,
            A.map(formatKeywordRank),
            A.map(item => ({
                rank: item.rank,
                createdAtFormatted: item.createdAtFormatted,
            })),
            A.filter(item => !!item.rank),
        )),
    )),
    E.either.sequence(T.task),
);