import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as E from "fp-ts/Either";
import {ObjectId} from 'mongodb';
import {SubmitWebsiteInput} from "app/input/SubmitWebsiteInput";
import {WebsiteCodec} from "app/entity/Website";

export const submitWebsite = (ctx: AppContext) => (input: SubmitWebsiteInput) => pipe(
    input.id
        ? pipe(
        ctx.repo.Website.findById(ObjectId.createFromHexString(input.id)),
        TE.fold(() => T.of(null), T.of)
        )
        : T.of(null),
    T.chain(current => pipe(
        ({
            ...current,
            id: current ? current.id : new ObjectId(),
            website: input.website,
        }),
        WebsiteCodec.decode,
        E.map(WebsiteCodec.encode),
        E.map(
            current
                ? ctx.repo.Website.updateOne
                : ctx.repo.Website.insertOne
        ),
        E.either.sequence(T.task),
    )),
);
