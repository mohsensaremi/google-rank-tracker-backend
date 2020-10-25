import {pipe} from "fp-ts/pipeable";
import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";
import {AppContext} from "app/context";
import {GetKeywordCategoriesInput} from "app/input/GetKeywordCategoriesInput";

export const getKeywordCategories = (ctx: AppContext) => (input: GetKeywordCategoriesInput) => pipe(
    async () => await ctx.repo.Keyword.getCollection().aggregate([
        {
            $match: {
                websiteId: input.websiteId,
            }
        },
        {
            $group: {
                _id: '$category',
            }
        },
    ]).toArray(),
    T.map(categories => pipe(
        categories,
        A.map(x => x._id),
        A.filter(x => !!x),
    )),
);