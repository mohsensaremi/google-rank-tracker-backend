import * as t from 'io-ts';

export const SettingsCodec = t.type({
    browserSearchSleepSeconds: t.number,
    keywordRankHistoryCount: t.number,
}, 'Settings');

export type Settings = t.TypeOf<typeof SettingsCodec>