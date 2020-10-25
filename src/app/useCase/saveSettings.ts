import {pipe} from "fp-ts/pipeable";
import fs from 'fs';
import {Settings} from "app/entity/Settings";
import path from "path";

export const saveSettings = (settings: Settings) => pipe(
    settings,
    JSON.stringify,
    (data => fs.writeFileSync(path.join(__dirname, '../../settings.json'), data, 'utf-8')),
    (() => settings),
)