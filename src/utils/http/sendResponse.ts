import {Response} from "express";
import {pipe} from "fp-ts/pipeable";

export const jsonResponse = <U, E>(data?: U, error?: E) => {
    return ({
        success: !error,
        status: error ? 500 : 200,
        [error ? 'error' : 'data']: error ? error : data,
    });
};

export const sendJsonResponse = (res: Response) => <U, E>(data?: U, error?: E) => pipe(
    jsonResponse(data, error),
    (json => res.json(json)),
)
