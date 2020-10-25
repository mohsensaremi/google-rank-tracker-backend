import {Db} from "mongodb";
import {AppContext, AppContextRepository} from "app/context/index";
import {Website, WebsiteCodec} from "app/entity/Website";
import {repositoryFactory} from "app/repository/factory";
import {Keyword, KeywordCodec} from "app/entity/Keyword";
import {mqChannelFactory} from "config/rabbitmq";
import {KeywordRank, KeywordRankCodec} from "app/entity/KeywordRank";
import SocketIO from "socket.io";

export const appContextFactory = async (DB: Db, socketIO: SocketIO.Server): Promise<AppContext> => {
    const repository: AppContextRepository = {
        Website: repositoryFactory<Website>(DB)("websites"),
        Keyword: repositoryFactory<Keyword>(DB)("keywords"),
        KeywordRank: repositoryFactory<KeywordRank>(DB)("keyword_ranks"),
    };

    const mqChannel = await mqChannelFactory();

    return {
        DB,
        mqChannel,
        socketIO,
        entity: {
            Website: WebsiteCodec,
            Keyword: KeywordCodec,
            KeywordRank: KeywordRankCodec,
        },
        repo: repository,
        repository: repository,
    };
};