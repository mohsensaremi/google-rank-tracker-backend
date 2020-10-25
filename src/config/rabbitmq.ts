import amqp from 'amqplib/callback_api';

export const mqFactory = (): Promise<amqp.Connection> => new Promise((resolve, reject) => {
    amqp.connect(`amqp://${process.env.MQ_HOST}`, function (err0, connection) {
        if (err0) return reject(err0);
        resolve(connection);
    })
})

export const mqChannelFactory = (): Promise<amqp.Channel> => mqFactory()
    .then(connection => new Promise((resolve, reject) => {
        connection.createChannel(function (err1, channel) {
            if (err1) return reject(err1);
            resolve(channel);
        })
    }))