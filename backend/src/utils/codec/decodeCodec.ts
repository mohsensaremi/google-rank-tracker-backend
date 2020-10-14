import * as E from 'fp-ts/lib/Either';
import {flow} from "fp-ts/lib/function";
import {PathReporter} from 'io-ts/lib/PathReporter'
import {Errors} from 'io-ts';
import {ApplicationError, ApplicationErrorKind} from "Error/ApplicationError";

export const decodeCodec = flow(
    E.mapLeft(err => {
        const report = PathReporter.report(E.left(err as Errors));
        return new ApplicationError({
            kind: ApplicationErrorKind.Codec,
            report: report,
        });
    }),
);
