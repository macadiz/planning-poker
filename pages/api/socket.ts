import { Server, ServerOptions } from "Socket.IO";

type SocketResponse = {
  socket: { server: (Partial<ServerOptions> & { io?: unknown }) | undefined };
  end: () => void;
};

const SocketHandler = (_: any, res: SocketResponse) => {
  if (res?.socket?.server?.io) {
    console.log("Socket is already running");
  } else if (res?.socket?.server) {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("player-join", (msg) => {
        console.log("Emmiting player-joined")
        socket.broadcast.emit("player-joined", msg);
      });

      socket.on("player-leave", (msg) => {
        console.log("Emmiting player-left")
        socket.broadcast.emit("player-left", msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;
