import express from 'express';
import {AppContext} from "app/context";
import {getWebsiteDatatable} from "app/useCase/getWebsiteDatatable";
import {pipe} from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as E from "fp-ts/Either";
import {DatatableInputCodec} from "app/repository/datatable";
import {routeHandlerTaskEither} from "utils/http/routeHandlerTaskEither";
import {submitWebsite} from "app/useCase/submitWebsite";
import {SubmitWebsiteInputCodec} from "app/input/SubmitWebsiteInput";
import {getWebsiteById} from "app/useCase/getWebsiteById";
import {GetKeywordDatatableInputCodec} from "app/input/GetKeywordDatatableInput";
import {getKeywordDatatable} from "app/useCase/getKeywordDatatable";
import {SubmitKeywordInputCodec} from "app/input/SubmitKeywordInput";
import {submitKeyword} from "app/useCase/submitKeyword";
import {enqueueKeyword} from "app/useCase/enqueueKeyword";
import {MongoDBObjectIDStringCodec} from "codec/MongoDBObjectIDString";
import {deleteWebsiteById} from "app/useCase/deleteWebsite";
import {deleteKeywordById} from "app/useCase/deleteKeyword";
import {GetKeywordRankDatatableInputCodec} from "app/input/GetKeywordRankDatatableInput";
import {getKeywordRankDatatable} from "app/useCase/getKeywordRankDatatable";
import {deleteKeywordRankById} from "app/useCase/deleteKeywordRank";
import {GetKeywordRankGraphInputCodec} from "app/input/GetKeywordRankGraphInput";
import {getKeywordRankGraph} from "app/useCase/getKeywordRankGraph";
import {getSettings} from "app/useCase/getSettings";
import {SettingsCodec} from "app/entity/Settings";
import {saveSettings} from "app/useCase/saveSettings";
import {decodeCodec} from "utils/codec/decodeCodec";
import {enqueueAllKeywords} from "app/useCase/enqueueAllKeywords";

export const httpFactory = (ctx: AppContext) => {
    const router = express.Router()

    router.get(
        '/website/datatable',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(DatatableInputCodec.decode(req.query)),
            TE.chain(input => TE.rightTask(getWebsiteDatatable(ctx)(input))),
        ))
    );

    router.get(
        '/website/:id',
        routeHandlerTaskEither((req) => pipe(
            getWebsiteById(ctx)(req.params.id),
        ))
    );

    router.get(
        '/keyword/datatable',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(GetKeywordDatatableInputCodec.decode(req.query)),
            TE.chain(input => TE.rightTask(getKeywordDatatable(ctx)(input))),
        ))
    );

    router.get(
        '/keyword-rank/datatable',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(GetKeywordRankDatatableInputCodec.decode(req.query)),
            TE.chain(input => TE.rightTask(getKeywordRankDatatable(ctx)(input))),
        ))
    );

    router.get(
        '/keyword-rank/graph',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(decodeCodec(GetKeywordRankGraphInputCodec.decode(req.query))),
            TE.chain(input => getKeywordRankGraph(ctx)(input)),
        ))
    );

    router.get(
        '/settings/get',
        routeHandlerTaskEither(() => pipe(
            T.of(getSettings()),
        ))
    );

    router.post(
        '/website/submit',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(SubmitWebsiteInputCodec.decode(req.body)),
            TE.chain(input => submitWebsite(ctx)(input)),
        ))
    );

    router.post(
        '/keyword/submit',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(SubmitKeywordInputCodec.decode(req.body)),
            TE.chain(input => submitKeyword(ctx)(input)),
        ))
    );

    router.post(
        '/website/delete',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(MongoDBObjectIDStringCodec.decode(req.body.id)),
            TE.chain(deleteWebsiteById(ctx)),
        ))
    );

    router.post(
        '/keyword/delete',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(MongoDBObjectIDStringCodec.decode(req.body.id)),
            TE.chain(deleteKeywordById(ctx)),
        ))
    );

    router.post(
        '/keyword-rank/delete',
        routeHandlerTaskEither((req) => pipe(
            TE.fromEither(MongoDBObjectIDStringCodec.decode(req.body.id)),
            TE.chain(deleteKeywordRankById(ctx)),
        ))
    );

    router.post(
        '/keyword/enqueue',
        routeHandlerTaskEither((req) => pipe(
            enqueueKeyword(ctx)(req.body.id)
        ))
    );

    router.post(
        '/keyword/enqueue-all',
        routeHandlerTaskEither(() => pipe(
            enqueueAllKeywords(ctx)
        ))
    );

    router.post(
        '/settings/set',
        routeHandlerTaskEither((req) => T.of(pipe(
            SettingsCodec.decode(req.body),
            E.map(saveSettings),
        )))
    );

    return router;
};