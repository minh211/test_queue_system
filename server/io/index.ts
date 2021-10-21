import { Server } from "socket.io";

function init() {
  let _io: Server | undefined;

  return {
    setIo: (io: Server) => (_io = io),
    getIo: () => _io,
  };
}

const { setIo, getIo } = init();

export { setIo, getIo };
