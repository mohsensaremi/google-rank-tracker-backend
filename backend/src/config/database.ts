import {Db, MongoClient} from 'mongodb';

export const databaseFactory = (): Promise<Db> => new Promise((resolve, reject) => {
    MongoClient.connect(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`,
        {
            auth: process.env.DB_USER && process.env.DB_PASS ? {
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
            } : undefined,
        },
        function (err, conn) {
            if (err) return reject(err);
            const db = conn.db(process.env.DB_NAME);
            resolve(db);
        }
    )
});