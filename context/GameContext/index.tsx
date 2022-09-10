import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import { Player } from "../../utils/player/type";
import { socketClient } from "../../utils/socket/client";
import { SocketClient, SocketSession } from "../../utils/socket/types";
import { Session, GameContextType } from "./types";

const GameContext = createContext<GameContextType>({
  client: null,
  session: null,
  setSession: () => {},
  player: null,
  players: [],
  setPlayer: () => {},
  addPlayer: () => {},
  removePlayer: () => {},
});

const GameContextProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const [client, setClient] = useState<SocketClient | null>(null);

  const [clientSession, setClientSession] = useState<SocketSession | null>(
    null
  );

  const [session, setSession] = useState<Session | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);
  const [player, setPlayer] = useState<Player | null>(null);

  const socketInitializer = useCallback(async () => {
    await fetch("/api/socket");
    setClient(socketClient(io()));
  }, []);

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

  useEffect(() => {
    socketInitializer();
  }, [socketInitializer]);

  useEffect(() => {
    if (client) {
      if (!client.socket.connected) {
        client.connect();
      }
    }
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [client]);

  useEffect(() => {
    if (client && session) {
      setClientSession(client.session(session.id));
    }
  }, [client, session]);

  useEffect(() => {
    if (clientSession) {
      clientSession.requestUsers();
      clientSession.onPlayerJoin(addPlayer);
      clientSession.onPlayerLeave(removePlayer);
      clientSession.onUserResponded(addPlayer);
    }
  }, [clientSession]);

  useEffect(() => {
    if (clientSession && player) {
      clientSession.onUserRequested(player);
    }
  }, [clientSession, player]);

  useEffect(() => {
    if (clientSession && session) {
      clientSession.respondSession(session);
    }
  }, [clientSession, session]);

  return (
    <GameContext.Provider
      value={{
        client,
        session,
        setSession,
        player,
        players,
        setPlayer,
        addPlayer,
        removePlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

const useGame = () => {
  return useContext(GameContext);
};

export { GameContextProvider, useGame };
