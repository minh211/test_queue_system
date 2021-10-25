import { Server } from "socket.io";

const io = new Server();

const Socket = {
  emit: function (event: string, data: unknown) {
    io.sockets.emit(event, data);
  },
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
});

export { Socket, io };
