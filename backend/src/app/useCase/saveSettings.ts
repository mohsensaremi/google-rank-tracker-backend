import {pipe} from "fp-ts/pipeable";
import fs from 'fs';
import {Settings} from "app/entity/Settings";

export const saveSettings = (settings: Settings) => pipe(
    settings,
    JSON.stringify,
    (data => fs.writeFileSync(`src/settings.json`, data, 'utf-8')),
    (() => settings),
)