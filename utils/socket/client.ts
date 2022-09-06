import { Socket } from "socket.io-client";

export const socketClient = (socket: Socket) => {
  const onSelfJoin = (name: string, id: string) => {
    socket.emit(
      "player-join",
      JSON.stringify({
        name,
        id,
      })
    );
  };

  const onSelfLeave = (id: string) => {
    socket.emit("player-leave", id);
  };

  const onPlayerJoin = (
    setNewPlayer: (name: string, id: string) => unknown
  ) => {
    socket.on("player-joined", (newPlayerData) => {
      const newPlayer = JSON.parse(newPlayerData);
      setNewPlayer(newPlayer.name, newPlayer.id);
    });
  };

  const onPlayerLeave = (removePlayer: (id: string) => unknown) => {
    socket.on("player-left", (playerLeftId) => {
      removePlayer(playerLeftId);
    });
  };

  const connect = () => {
    socket.on("connect", () => {
      console.log("connected");
    });
  }

  return {
    onSelfJoin,
    onSelfLeave,
    onPlayerJoin,
    onPlayerLeave,
    connect,
    socket
  };
};
