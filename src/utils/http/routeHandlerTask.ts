import {Request, Response} from "express";
import {pipe} from "fp-ts/lib/pipeable";
import * as T from 'fp-ts/lib/Task';
import {sendJsonResponse} from "./sendResponse";

export type RouteHandlerFnTask<U> = (req: Request) => T.Task<U>

export const routeHandlerTask = <U>(fn: RouteHandlerFnTask<U>) => (req: Request, res: Response) => pipe(
    fn(req),
    (task =>
            task().then(data => sendJsonResponse(res)(data))
    ),
);