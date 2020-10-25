import {Db} from "mongodb";
import {Entity} from "app/entity";
import {pipe} from "fp-ts/lib/pipeable";
import * as T from 'fp-ts/lib/Task';
import {Datatable, DatatableInput} from "app/repository/datatable";

export const datatableFactory = (db: Db) => (collection: string) => <U extends Entity>(input: DatatableInput, find?: any, options?: any): T.Task<Datatable<U>> => pipe(
    async () => {
        input = {
            orderBy: '_id',
            order: 'desc',
            limit: 25,
            skip: 0,
            ...input,
        };
        let {limit, skip, search, searchColumns, order, orderBy} = input;
        if ((order as any) === "asc") {
            order = 1 as any;
        } else if ((order as any) === "desc") {
            order = -1 as any;
        }

        if (search) {
            search = search.trim();
        }
        if (searchColumns && !Array.isArray(searchColumns)) {
            searchColumns = [searchColumns];
        }

        let query = {};
        if (search && Array.isArray(searchColumns)) {
            const searchQuery = searchColumns
                .map(item => {
                    return {[item]: new RegExp(`${search}`)};
                });
            if (find) {
                query = {
                    $and: [
                        find,
                        {$or: searchQuery},
                    ],
                };
            } else {
                query = {
                    $or: searchQuery,
                };
            }
        } else {
            query = find;
        }

        let cursor = db.collection(collection).find(query, options);
        if (orderBy) {
            cursor = cursor.sort({[orderBy]: Number(order)});
        }
        if (skip !== undefined && limit !== undefined) {
            limit = Number(limit);
            skip = Number(skip);

            const queryCount = cursor.count();
            const queryData: Promise<U[]> = cursor.skip(skip).limit(limit).toArray();

            const [total, data] = await Promise.all([queryCount, queryData]);

            data.map(x => {
                (x as any).id = (x as any)._id;
                return x;
            });

            return {data, total};
        }

        return {data: [], total: 0};
    },
);
