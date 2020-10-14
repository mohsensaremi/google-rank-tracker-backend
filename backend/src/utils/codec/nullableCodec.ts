import * as t from 'io-ts';

export const nullableCodec = <A>(x: t.Type<A>) => t.union([x, t.null]);
