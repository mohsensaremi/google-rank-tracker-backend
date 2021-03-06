import {pipe} from "fp-ts/pipeable";
import * as E from "fp-ts/Either";
import fs from 'fs';
import {ApplicationError, ApplicationErrorKind} from "Error/ApplicationError";
import {decodeCodec} from "utils/codec/decodeCodec";
import {SettingsCodec} from "app/entity/Settings";
import path from 'path';

export const getSettings = () => pipe(
    () => pipe(
        fs.readFileSync(path.join(__dirname, '../../settings.json'), 'utf-8'),
        (json => E.tryCatch(
            () => JSON.parse(json),
            (error: any) => new ApplicationError({
                kind: ApplicationErrorKind.Unknown,
                data: error,
            })
        )),
        E.chain(x => decodeCodec(SettingsCodec.decode(x))),
    ),
    (readSettingsFn => pipe(
        fs.existsSync(path.join(__dirname, '../../settings.json'))
            ? readSettingsFn()
            : pipe(
            fs.copyFileSync(path.join(__dirname, '../../settings.default.json'), path.join(__dirname, '../../settings.json')),
            (() => readSettingsFn())
            )
    )),
)