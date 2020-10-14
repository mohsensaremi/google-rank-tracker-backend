import * as t from 'io-ts';
import {OutputOf, PartialType, Props, TypeOf} from 'io-ts';
import {nullableCodec} from "utils/codec/nullableCodec";

export interface PartialNullableC<P extends Props> extends PartialType<P, {
    [K in keyof P]?: TypeOf<P[K]> | null;
}, {
    [K in keyof P]?: OutputOf<P[K]> | null;
}, unknown> {
}

export type PartialNullableType = <P extends Props>(props: P, name?: string) => PartialNullableC<P>;

export const partialNullableType: PartialNullableType = <P extends Props>(props: P, name?: string) => t.partial(
    Object.entries(props).map(([key, value]) => ([key, nullableCodec(value)]))
        .reduce((acc, [key, value]) => ({...acc, [key as string]: value}), {}) as any,
    name
);
