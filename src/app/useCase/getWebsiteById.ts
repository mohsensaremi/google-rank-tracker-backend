import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import {ObjectId} from "mongodb";

export const getWebsiteById = (ctx: AppContext) => (id: string) => pipe(
    ctx.repo.Website.findById(ObjectId.createFromHexString(id)),
);