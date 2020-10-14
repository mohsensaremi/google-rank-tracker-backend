import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import {Datatable, DatatableInput} from "./datatable";
import {ObjectId} from 'mongodb';

export type Repository<U extends { id: ObjectId }> = {
    insertOne: <X extends U>(data: X) => T.Task<X>
    updateOne: <X extends U>(data: X) => T.Task<X>
    deleteOne: <X extends U>(data: X) => T.Task<X>
    find: (query?: any, options?: any) => T.Task<U[]>
    findCount: (query?: any, options?: any) => T.Task<number>
    findById: (id: U['id']) => TE.TaskEither<any, U>
    findOne: (query: any) => TE.TaskEither<any, U>
    datatable: (input: DatatableInput, find?: any, options?: any) => T.Task<Datatable<U>>
}
