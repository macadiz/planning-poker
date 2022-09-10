import { Server, ServerOptions } from "Socket.IO";
import { socketServer } from "../../utils/socket/server";

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
      const socketEvents = socketServer(socket);

      socketEvents.onPlayerJoin();
      socketEvents.onPlayerLeave();

      socketEvents.onUserRequest();
      socketEvents.onUserResponse();

      socketEvents.onSessionRequest();
      socketEvents.onSessionResponded();
    });
  }
  res.end();
};

export default SocketHandler;
