import SocketIO from 'socket.io';
import {Server} from 'http';

export const socketIOFactory = (server: Server) => {
    return SocketIO(server)
};