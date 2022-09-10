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
    socket.on("user-request", (sessionId) => {
        console.log("Emmiting user-request");
        socket.broadcast.emit("user-requested", sessionId);
    });
  }

  const onUserResponse = () => {
    socket.on("user-response", (msg) => {
        console.log("Emmiting user-response");
        socket.broadcast.emit("user-responded", msg);
    });
  }

  const onSessionRequest = () => {
    socket.on("request-session", (sessionData) => {
      console.log("Emmiting session-requested");
      socket.broadcast.emit("session-requested", sessionData);
     });
  }

  const onSessionResponded = () => {
    socket.on("session-response", (sessionData) => {
      console.log("Emmiting session-responded");
      socket.broadcast.emit("session-responded");
     });
  }

  return {
    onPlayerJoin,
    onPlayerLeave,
    onUserRequest,
    onUserResponse,
    onSessionRequest,
    onSessionResponded
  };
};
