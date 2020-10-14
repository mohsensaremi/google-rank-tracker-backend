import {Request, Response} from "express";
import {pipe} from "fp-ts/lib/pipeable";
import {isRight} from 'fp-ts/lib/Either';
import {sendJsonResponse} from "./sendResponse";
import {PathReporter} from 'io-ts/lib/PathReporter'
import * as TE from "fp-ts/TaskEither";

export type RouteHandlerFnTaskEither<E, U> = (req: Request) => TE.TaskEither<E, U>

export const routeHandlerTaskEither = <E, U>(fn: RouteHandlerFnTaskEither<E, U>) => (req: Request, res: Response) => pipe(
    fn(req),
    (taskEither => taskEither().then(
        either => {
            isRight(either)
                ? sendJsonResponse(res)(either.right)
                : sendJsonResponse(res)(null, Array.isArray(either.left) ? PathReporter.report(either as any) : either.left);
        }
    )),
);
