"use client";

import Board from "@/components/Board/Board";
import TopBar from "@/components/TopBar/TopBar";
import { use, useEffect, useState } from "react";
import socket, { connectSocket, disconnectSocket } from "@/lib/socket";
import { Cell, Player, Players } from "@/utils/types";
import { useSearchParams } from "next/navigation";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = use(params).roomId;

  const [isConnected, setIsConnected] = useState(false);
  const [state, setState] = useState(null);

  const [isWaitingForPlayer, setIsWaitingForPlayer] = useState(false);

  const [players, setPlayers] = useState<Players | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const searchParams = useSearchParams();
  const playerName = searchParams.get("player-name") || "Player";

  useEffect(() => {
    if (connectSocket()) setIsConnected(true);

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("error", (error) => {
      console.error(error);
      throw error;
    });

    socket.on("message", (event) => {});

    socket.on("waitingForPlayer", () => {
      setIsWaitingForPlayer(true);
    });

    socket.on("playerLeft", (gameState) => {
      console.log("Player left");
      setIsWaitingForPlayer(true);
    });

    socket.on("startGame", (gameState) => {
      console.log("Game started!");
      console.log(gameState);
      setIsWaitingForPlayer(false);
      setPlayers(gameState.players);
      setCurrentPlayer(gameState.currentPlayer);
      setState(gameState);
    });

    socket.on("updateGameState", (gameState) => {
      console.log("Game updated!");
      console.log(gameState);
      setCurrentPlayer(gameState.currentPlayer);
      setState(gameState);
    });

    return () => {
      disconnectSocket();
    };
  }, [socket]);

  useEffect(() => {
    console.log("Joining room...");
    console.log("Name: ", playerName);
    if (isConnected) {
      console.log(`Auto-joining room: ${roomId}`);
      socket && socket.emit("joinRoom", { roomId, playerName: playerName });
    }
  }, [isConnected]);

  const handlePlayMove = (clickedCell: Cell) => {
    console.log("Playing move...");
    console.log(clickedCell);
    socket.emit("playerMove", { roomId, clickedCell });
  };

  const restartGame = () => {};

  return (
    <div>
      {isWaitingForPlayer ? (
        <h1>Waiting for players...</h1>
      ) : state && currentPlayer ? (
        <div>
          <TopBar currentPlayer={currentPlayer} players={players} />
          <Board
            gameState={state}
            handlePlay={handlePlayMove}
            restartGame={restartGame}
          />
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
