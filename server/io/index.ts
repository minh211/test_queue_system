import { Server } from "socket.io";

const io = new Server();

const Socket = {
  emit: function (event: any, data: any) {
    console.log(event, data);
    io.sockets.emit(event, data);
  },
};

io.on("connection", function (socket) {
  console.log("clientCount:", Object.keys(io.engine.clients));

  console.log("A user connected", socket.id);
});

export { Socket, io };
