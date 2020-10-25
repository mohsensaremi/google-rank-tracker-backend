import {KeywordRank} from "app/entity/KeywordRank";
import {Keyword} from "app/entity/Keyword";
import DataLoader from "dataloader";
import {ObjectId} from "mongodb";
import {pipe} from "fp-ts/pipeable";
import * as T from "fp-ts/Task";

export const formatKeyword = (loader: {
    pendingRankLoader: DataLoader<ObjectId, KeywordRank | null>
}) => (input: Keyword) => pipe(
    () => loader.pendingRankLoader.load(input.id),
    T.map(pendingRank => ({
        ...input,
        pendingRank,
    })),
);