import React from 'react';
import * as io from 'socket.io-client';
const socketUrl:any = process.env.REACT_APP_SOCKET_URL
export const socket = io.connect(socketUrl, {
  transports: ['websocket'],
  forceNew: false,
});
const SocketContext = React.createContext(socket);

export default SocketContext;
