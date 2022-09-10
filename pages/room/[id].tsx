import React, { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useGame } from "../../context/GameContext";
import { useRouter } from "next/router";

const Room = () => {
  const router = useRouter();
  const { id } = router.query;

  const sessionId = id as string;

  const { client, removePlayer, setPlayer, players, player } = useGame();

  if (!client) {
    return null;
  }

  const onLeave = () => {
    if (player) {
      client.session(sessionId).leaveRoom(player.id);

      removePlayer(player.id);
      setPlayer(null);

      router.replace("/");
    }
  };

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
      <button onClick={onLeave}>Leave</button>
    </>
  );
};

export default Room;
