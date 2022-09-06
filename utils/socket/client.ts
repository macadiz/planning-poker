import { Socket } from "socket.io-client";
import { Player } from "../player/type";

export const socketClient = (socket: Socket) => {
  const onSelfJoin = (name: string, id: string) => {
    socket.emit("player-join", {
      name,
      id,
    });
  };

  const onSelfLeave = (id: string) => {
    socket.emit("player-leave", id);
  };

  const onPlayerJoin = (setNewPlayer: (player: Player) => unknown) => {
    socket.on("player-joined", (newPlayerData) => {
      const newPlayer = newPlayerData as Player;
      setNewPlayer(newPlayer);
    });
  };

  const onPlayerLeave = (removePlayer: (id: string) => unknown) => {
    socket.on("player-left", (playerLeftId) => {
      removePlayer(playerLeftId);
    });
  };

  const onUserRequest = (player: Player) => {
    socket.on("user-requested", () => {
      socket.emit("user-response", player);
    });
  };

  const onUserResponse = (setNewPlayer: (player: Player) => void) => {
    socket.on("user-responded", (playerData) => {
      const player = playerData as Player;
      setNewPlayer(player);
    });
  };

  const requestUsers = () => {
    socket.emit("user-request", "");
  };

  const connect = () => {
    socket.on("connect", () => {
      console.log("connected");
    });
  };

  return {
    onSelfJoin,
    onSelfLeave,
    onPlayerJoin,
    onPlayerLeave,
    onUserRequest,
    onUserResponse,
    requestUsers,
    connect,
    socket,
  };
};
