import {Db} from "mongodb";
import {Website, WebsiteCodec} from "app/entity/Website";
import {Repository} from "app/repository";
import {Keyword, KeywordCodec} from "app/entity/Keyword";
import amqp from "amqplib/callback_api";
import {KeywordRank, KeywordRankCodec} from "app/entity/KeywordRank";
import SocketIO from 'socket.io';

export type AppContextRepository = {
    Website: Repository<Website>
    Keyword: Repository<Keyword>
    KeywordRank: Repository<KeywordRank>
}

export type AppContext = {
    DB: Db,
    mqChannel: amqp.Channel,
    socketIO:SocketIO.Server,
    entity: {
        Website: typeof WebsiteCodec,
        Keyword: typeof KeywordCodec,
        KeywordRank: typeof KeywordRankCodec,
    },
    repo: AppContextRepository,
    repository: AppContextRepository,
};