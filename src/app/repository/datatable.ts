import {Entity} from "app/entity";
import * as t from "io-ts";
import {partialNullableType} from "utils/codec/partialNullableType";

export const DatatableInputCodec = partialNullableType({
    limit: t.union([t.number, t.string]),
    skip: t.union([t.number, t.string]),
    search: t.string,
    searchColumns: t.array(t.string),
    order: t.string,
    orderBy: t.string,
});

export type DatatableInput = t.TypeOf<typeof DatatableInputCodec>

export type Datatable<U extends Entity> = {
    data: U[],
    total: number,
}
