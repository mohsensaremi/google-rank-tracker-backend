import {Keyword} from "app/entity/Keyword";
import {KeywordRank} from "app/entity/KeywordRank";

export enum ApplicationErrorKind {
    Unknown = "Unknown",
    NextPageElemNotFound = "NextPageElemNotFound",
    Codec = "Codec",
    GetRank = "GetRank",
    PendingKeywordRankAlreadyExists = "PendingKeywordRankAlreadyExists",
}

type UnknownError = {
    kind: ApplicationErrorKind.Unknown,
    data: any,
}

type NextPageElemNotFoundError = {
    kind: ApplicationErrorKind.NextPageElemNotFound,
}

type GetRankError = {
    kind: ApplicationErrorKind.GetRank,
    data: any,
}

type PendingKeywordRankAlreadyExists = {
    kind: ApplicationErrorKind.PendingKeywordRankAlreadyExists,
    keyword: Keyword,
    keywordRank: KeywordRank,
}

type CodecError = {
    kind: ApplicationErrorKind.Codec,
    report: string[],
}

type ApplicationErrorData =
    | UnknownError
    | NextPageElemNotFoundError
    | CodecError
    | GetRankError
    | PendingKeywordRankAlreadyExists

export class ApplicationError extends Error {
    constructor(public data: ApplicationErrorData) {
        super(data.kind);
    }
}