import {pipe} from "fp-ts/pipeable";
import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";
import {AppContext} from "app/context";
import {GetKeywordDatatableInput} from "app/input/GetKeywordDatatableInput";
import DataLoader from "dataloader";
import {ObjectId} from 'mongodb';
import keyBy from 'lodash/keyBy';
import {formatKeyword} from "app/useCase/formatKeyword";

export const getKeywordDatatable = (ctx: AppContext) => (input: GetKeywordDatatableInput) => pipe(
    ctx.repo.Keyword.datatable(input, {
        websiteId: input.websiteId,
    }),
    T.chain(dt => pipe(
        ({
            lastRankLoader: new DataLoader(lastRankLoaderFn(ctx)),
            pendingRankLoader: new DataLoader(pendingRankLoaderFn(ctx)),
        }),
        (loader => pipe(
            dt.data,
            A.map(formatKeyword(loader)),
            A.array.sequence(T.task),
        )),
        T.map(data => ({
            ...dt,
            data,
        }))
    )),
);

const lastRankLoaderFn = (ctx: AppContext) => async (ids: readonly ObjectId[]) => {
    const items = await ctx.repo.KeywordRank.find({
        keywordId: {$in: ids.map(x => String(x))},
        state: "done",
    })();
    const itemsByKeywordId = keyBy(items, "keywordId");
    return ids.map(id => itemsByKeywordId[String(id)] || null);
};

const pendingRankLoaderFn = (ctx: AppContext) => async (ids: readonly ObjectId[]) => {
    const items = await ctx.repo.KeywordRank.find({
        keywordId: {$in: ids.map(x => String(x))},
        state: "pending",
    })();
    const itemsByKeywordId = keyBy(items, "keywordId");
    return ids.map(id => itemsByKeywordId[String(id)] || null);
};