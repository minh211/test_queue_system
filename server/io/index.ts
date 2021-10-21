import { Server } from "socket.io";

let _io: Server;

export const setIo = (io: Server) => {
  console.log("setIO");
  _io = io;
};
export const getIo = () => _io;
