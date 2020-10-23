import {AppContext} from "app/context";
import {pipe} from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as E from "fp-ts/Either";
import {ObjectId} from 'mongodb';
import {SubmitKeywordInput} from "app/input/SubmitKeywordInput";
import {KeywordCodec} from "app/entity/Keyword";

export const submitKeyword = (ctx: AppContext) => (input: SubmitKeywordInput) => pipe(
    input.id
        ? pipe(
        ctx.repo.Keyword.findById(ObjectId.createFromHexString(input.id)),
        TE.fold(() => T.of(null), T.of)
        )
        : T.of(null),
    T.chain(current => pipe(
        ({
            ...current,
            id: current ? current.id : new ObjectId(),
            title: input.title,
            platform: input.platform,
            websiteId: input.websiteId,
        }),
        KeywordCodec.decode,
        E.map(KeywordCodec.encode),
        E.map(
            current
                ? ctx.repo.Keyword.updateOne
                : ctx.repo.Keyword.insertOne
        ),
        E.either.sequence(T.task),
    )),
);
