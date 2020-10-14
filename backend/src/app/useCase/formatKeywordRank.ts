import {KeywordRank} from "app/entity/KeywordRank";
import moment from 'moment';

export const formatKeywordRank = (input: KeywordRank) => ({
    ...input,
    createdAtFormatted: moment(input.createdAt).format("YYYY-MM-DD HH:mm"),
    createdAtUnix: moment(input.createdAt).unix(),
});