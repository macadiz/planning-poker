import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useGame } from "../context/GameContext";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { client, setSession, session, player, setPlayer, addPlayer } =
    useGame();

  const router = useRouter();

  const [playerName, setPlayerName] = useState("");

  const [sessionName, setSessionName] = useState("");
  const [sessionCode, setSessionCode] = useState("");

  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    if (client && session && player) {
      client.session(session.id).joinRoom(player);

      addPlayer(player);

      router.replace(`/room/${session.id}`);
    }
  }, [client, session, player]);

  useEffect(() => {
    if (client && player) {
      if (!showJoin) {
        setSession({ id: nanoid(), name: sessionName, isOwner: true });
      } else {
        client.onReceiveSession(player.id, setSession);

        client.requestSession(player, sessionCode);
      }
    }
  }, [client, player, showJoin]);

  if (!client) {
    return null;
  }

  const onJoinClick = () => {
    setShowJoin(true);
  };

  const onCreateClick = () => {
    setShowJoin(false);
  };

  const onRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(event.target.value);
  };

  const onPlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  const onRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionCode(event.target.value);
  };

  const onCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const player = {
      id: nanoid(),
      name: playerName,
    };

    setPlayer(player);
  };

  const onJoinSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const player = {
      id: nanoid(),
      name: playerName,
    };

    setPlayer(player);
  };

  return (
    <>
      {!showJoin ? (
        <form onSubmit={onCreateSubmit} autoComplete="off">
          <h1>Create room</h1>
          <input
            placeholder="Room name"
            value={sessionName}
            onChange={onRoomNameChange}
          />
          <input
            placeholder="Your name"
            value={playerName}
            onChange={onPlayerNameChange}
          />
          <button type="submit">Create</button>
          <a href="#" onClick={onJoinClick}>
            or join a room
          </a>
        </form>
      ) : (
        <form onSubmit={onJoinSubmit} autoComplete="off">
          <h1>Join room</h1>
          <input
            placeholder="Room code"
            value={sessionCode}
            onChange={onRoomCodeChange}
          />
          <input
            placeholder="Your name"
            value={playerName}
            onChange={onPlayerNameChange}
          />
          <button type="submit">Join</button>
          <a href="#" onClick={onCreateClick}>
            or create a room
          </a>
        </form>
      )}
    </>
  );
};

export default Home;
