import { Socket } from "socket.io-client";
import { Session } from "../../context/GameContext/types";
import { Player } from "../player/type";
import { SocketClient } from "./types";

export const socketClient = (socket: Socket): SocketClient => {
  const session = (sessionId: string) => {
    const joinRoom = (player: Player) => {
      socket.emit("player-join", {
        sessionId,
        player,
      });
    };

    const leaveRoom = (id: string) => {
      socket.emit("player-leave", { sessionId, playerId: id });
    };

    const onPlayerJoin = (setNewPlayer: (player: Player) => unknown) => {
      socket.on("player-joined", (playerData) => {
        if (playerData.sessionId === sessionId) {
          const newPlayer = playerData.player as Player;
          setNewPlayer(newPlayer);
        }
      });
    };

    const onPlayerLeave = (removePlayer: (id: string) => unknown) => {
      socket.on("player-left", (playerLeftData) => {
        if (playerLeftData.sessionId === sessionId) {
          removePlayer(playerLeftData.playerId);
        }
      });
    };

    const onUserRequested = (player: Player) => {
      socket.on("user-requested", () => {
        socket.emit("user-response", { sessionId, player });
      });
    };

    const onUserResponded = (setNewPlayer: (player: Player) => void) => {
      socket.on("user-responded", (playerData) => {
        if (playerData.sessionId === sessionId) {
          const player = playerData.player as Player;
          setNewPlayer(player);
        }
      });
    };

    const requestUsers = () => {
      socket.emit("user-request", sessionId);
    };

    const respondSession = (session: Session) => {
      socket.on("session-requested", (sessionData) => {
        console.log("Receiving session-requested");
        if (session.isOwner && session.id === sessionData.sessionId) {
          console.log("Emitting session-response")
          socket.emit('session-response', {
            to: sessionData.player.id,
            session: {
              id: session.id,
              name: session.name,
            }
          })
        }
      });
    }

    return {
      joinRoom,
      leaveRoom,
      onPlayerJoin,
      onPlayerLeave,
      onUserRequested,
      onUserResponded,
      requestUsers,
      respondSession
    };
  };

  const requestSession = (player: Player, sessionId: string) => {
    console.log("Emitting request-session");
    socket.emit('request-session', {
      player,
      sessionId
    });
  }

  const createSession = (session: Session, player: Player) => {
    socket.emit('create-session', {
      session,
      player
    });
  }

  const onReceiveSession = (
    playerId: string,
    setSession: (session: Session) => void
  ) => {
    socket.on("session-responded", (sessionData) => {
      if (sessionData.to === playerId) {
        setSession(sessionData.session);
      }
    });
  };

  const connect = () => {
    socket.on("connect", () => {
      console.log("connected");
    });
  };

  const disconnect = () => {
    socket.disconnect();
  };

  return {
    session,
    requestSession,
    createSession,
    onReceiveSession,
    connect,
    disconnect,
    socket,
  };
};
