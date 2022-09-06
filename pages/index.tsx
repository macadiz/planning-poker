import React, { useCallback, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Player } from "../utils/player/type";
import uuid from "react-uuid";
import { socketClient } from "../utils/socket/client";

const Home = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const [player, setPlayer] = useState<Player | null>(null);

  const addPlayer = (player: Player) => {
    setPlayers((currentPlayers) => {
      const playerExists =
        currentPlayers.findIndex(
          (currentPlayer) => currentPlayer.id === player.id
        ) !== -1;
      if (playerExists) {
        return currentPlayers;
      }
      const newPlayers = [...currentPlayers];
      newPlayers.push(player);
      return newPlayers;
    });
  };

  const removePlayer = (id: string) => {
    setPlayers((currentPlayers) => {
      const newPlayers = [...currentPlayers];

      const playerToDelete = newPlayers.find((player) => player.id === id);

      if (playerToDelete) {
        newPlayers.splice(newPlayers.indexOf(playerToDelete), 1);
      }

      return newPlayers;
    });
  };

  const socketInitializer = useCallback(async () => {
    await fetch("/api/socket");
    setSocket(io());
  }, []);

  useEffect(() => {
    setPlayerId(uuid());
  }, []);

  useEffect(() => {
    socketInitializer();
  }, [socketInitializer]);

  useEffect(() => {
    if (socket) {
      const client = socketClient(socket);
      if (!client.socket.connected) {
        client.connect();
      }
      client.requestUsers();
      client.onPlayerJoin(addPlayer);
      client.onPlayerLeave(removePlayer);
      client.onUserResponse(addPlayer);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket && player) {
      const client = socketClient(socket);
      client.onUserRequest(player);
    }
  }, [socket, player]);

  if (!socket) {
    return null;
  }

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  const onJoinSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (playerId) {
      socketClient(socket).onSelfJoin(name, playerId);

      const newPlayer = {
        name,
        id: playerId,
      };

      addPlayer(newPlayer);
      setPlayer(newPlayer);
    }
  };

  const onLeave = () => {
    if (playerId) {
      socketClient(socket).onSelfLeave(playerId);

      removePlayer(playerId);
      setPlayer(null);
    }
  };

  const hasJoined = !!players.find((player) => player.id === playerId);

  return (
    <>
      <div>
        Players
        <ul>
          {players.map((player) => {
            return (
              <li key={player.id}>
                {player.name} - {player.id}
              </li>
            );
          })}
        </ul>
      </div>
      {!hasJoined ? (
        <form onSubmit={onJoinSubmit}>
          Join the game
          <input placeholder="Name" onChange={onNameChange} value={name} />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <button onClick={onLeave}>Leave</button>
      )}
    </>
  );
};

export default Home;
