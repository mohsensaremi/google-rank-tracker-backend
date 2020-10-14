import {KeywordRank} from "app/entity/KeywordRank";
import {Keyword} from "app/entity/Keyword";
import DataLoader from "dataloader";
import {ObjectId} from "mongodb";
import {pipe} from "fp-ts/pipeable";
import * as T from "fp-ts/Task";

export const formatKeyword = (loader: {
    lastRankLoader: DataLoader<ObjectId, KeywordRank | null>
    pendingRankLoader: DataLoader<ObjectId, KeywordRank | null>
}) => (input: Keyword) => pipe(
    () => loader.lastRankLoader.load(input.id),
    T.chain(lastRank => pipe(
        () => loader.pendingRankLoader.load(input.id),
        T.map(pendingRank => ({
            ...input,
            lastRank,
            pendingRank,
        })),
    )),
);