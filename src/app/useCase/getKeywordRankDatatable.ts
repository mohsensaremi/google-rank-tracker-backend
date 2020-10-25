import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import {GetKeywordRankDatatableInput} from "app/input/GetKeywordRankDatatableInput";
import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";
import {formatKeywordRank} from "app/useCase/formatKeywordRank";

export const getKeywordRankDatatable = (ctx: AppContext) => (input: GetKeywordRankDatatableInput) => pipe(
    ctx.repo.KeywordRank.datatable(input, {
        keywordId: input.keywordId,
    }),
    T.map(dt => pipe(
        dt.data,
        A.map(formatKeywordRank),
        (data => ({
            ...dt,
            data,
        }))
    )),
);