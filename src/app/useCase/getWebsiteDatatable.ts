import {AppContext} from "app/context";
import {DatatableInput} from "app/repository/datatable";
import {pipe} from "fp-ts/pipeable";

export const getWebsiteDatatable = (ctx: AppContext) => (input: DatatableInput) => pipe(
    ctx.repo.Website.datatable(input),
);