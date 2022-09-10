import { Socket } from "socket.io-client";
import { Session } from "../../context/GameContext/types";
import { Player } from "../player/type";

export type SocketClient = {
  session: (sessionId: string) => SocketSession;
  createSession: (session: Session, player: Player) => void;
  requestSession: (player: Player, sessionId: string) => void;
  onReceiveSession: (
    playerId: string,
    setSession: (session: Session) => void
  ) => void;
  connect: () => void;
  disconnect: () => void;
  socket: Socket;
};

export type SocketSession = {
  onPlayerJoin: (setNewPlayer: (player: Player) => unknown) => void;
  onPlayerLeave: (removePlayer: (id: string) => unknown) => void;
  onUserRequested: (player: Player) => void;
  onUserResponded: (setNewPlayer: (player: Player) => void) => void;
  respondSession: (session: Session) => void;
  joinRoom: (player: Player) => void;
  leaveRoom: (id: string) => void;
  requestUsers: () => void;
};
