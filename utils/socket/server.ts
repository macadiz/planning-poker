import { Socket } from "Socket.IO";

export const socketServer = (socket: Socket) => {
  const onPlayerJoin = () => {
    socket.on("player-join", (msg) => {
      console.log("Emmiting player-joined");
      socket.broadcast.emit("player-joined", msg);
    });
  };

  const onPlayerLeave = () => {
    socket.on("player-leave", (msg) => {
      console.log("Emmiting player-left");
      socket.broadcast.emit("player-left", msg);
    });
  };

  const onUserRequest = () => {
    socket.on("user-request", () => {
        console.log("Emmiting user-request");
        socket.broadcast.emit("user-requested");
    });
  }

  const onUserResponse = () => {
    socket.on("user-response", (msg) => {
        console.log("Emmiting user-response");
        socket.broadcast.emit("user-responded", msg);
    });
  }

  return {
    onPlayerJoin,
    onPlayerLeave,
    onUserRequest,
    onUserResponse
  };
};
