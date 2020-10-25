import * as t from 'io-ts';
import moment from 'moment';

export const DateCodec = new t.Type<Date, Date, unknown>(
    'DateCodec',
    (u): u is Date => u instanceof Date,
    (u, c) => (u instanceof Date || typeof u === "string") && moment(u).isValid() ? t.success(moment(u).toDate()) : t.failure(u, c),
    t.identity
);
