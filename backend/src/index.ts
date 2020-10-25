import 'config/dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {databaseFactory} from 'config/database';
import {appContextFactory} from "app/context/factory";
import {httpFactory} from "app/http";
import {keywordRankQueueFactory} from "app/queue/keywordRankQueue";
import http from 'http';
import {socketIOFactory} from "config/socketIO";
import {registerCronJobs} from "app/schedule";
import {getSettings} from "app/useCase/getSettings";
import * as E from "fp-ts/Either";

const settingsEither = getSettings();
if (E.isRight(settingsEither)) {
    console.log("settings", settingsEither.right);
    databaseFactory().then(db => {
        console.log("database connected successfully");


        const app = express();

        app.use(cors());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());

        const server = http.createServer(app);
        const socketIO = socketIOFactory(server);

        appContextFactory(db, socketIO).then(ctx => {
            console.log("context created successfully");

            const router = httpFactory(ctx);

            app.use(router);

            keywordRankQueueFactory(ctx);

            server.listen(process.env.APP_PORT, () => {
                console.log(`listening on ${process.env.APP_PORT}`);
                registerCronJobs(ctx);
            });
        });
    });
} else {
    throw settingsEither.left;
}