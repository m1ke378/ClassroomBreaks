"use client";

import Board from "@/components/Board/Board";
import TopBar from "@/components/TopBar/TopBar";
import { use, useEffect, useRef, useState } from "react";
import socket, { connectSocket, disconnectSocket } from "@/lib/socket";
import { Cell, Player, Players } from "@/utils/types";
import NameModal from "@/components/NameModal/NameModal";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomID: string; visibility: string }>;
}) {
  const { roomID, visibility } = use(params);

  const [isConnected, setIsConnected] = useState(false);
  const [state, setState] = useState(null);

  const [isWaitingForPlayer, setIsWaitingForPlayer] = useState(false);

  const [players, setPlayers] = useState<Players | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const reconectionTimoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (connectSocket()) setIsConnected(true);

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("error", (errorMessage) => {
      console.error("Socket error:", errorMessage);
      toast.error(errorMessage);
      router.push(`/ultimate-tic-tac-toe/online/${visibility}/create`);
    });

    socket.on("token", (newToken) => {
      console.log("Token received:", newToken);
      sessionStorage.setItem("token", newToken);
    });

    socket.on("message", (event) => {});

    socket.on("waitingForPlayer", () => {
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

    socket.on("playerDisconnected", () => {
      toast.warn("Player disconnected, waiting for reconnection...");
      setIsWaitingForPlayer(true);
      reconectionTimoutRef.current = setTimeout(() => {
        toast.error("Player did not reconnect in time");
        router.push(`/ultimate-tic-tac-toe/online/${visibility}/create`);
      }, 10000);
    });

    socket.on("playerReconnected", () => {
      if (reconectionTimoutRef.current) {
        clearTimeout(reconectionTimoutRef.current);
      }
      toast.success("Player reconnected");
      setIsWaitingForPlayer(false);
    });

    socket.on("player2Left", () => {
      toast.error("Player left");
      setIsWaitingForPlayer(true);
      setPlayers(null);
      setCurrentPlayer(null);
      setState(null);
    });

    socket.on("hostLeft", () => {
      toast.error("Host left");
      router.push(`/ultimate-tic-tac-toe/online/${visibility}/create`);
    });

    socket.on("passwordError", () => {
      toast.error("Incorrect or missing password");
      openModal();
    });

    return () => {
      console.log("Cleaning up room");
      socket.emit("leaveRoom");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("playerName");
      sessionStorage.removeItem("password");
      disconnectSocket();
    };
  }, [socket]);

  useEffect(() => {
    const playerName = sessionStorage.getItem("playerName") || undefined;
    const password = sessionStorage.getItem("password") || undefined;

    console.log("Player name: ", playerName);
    console.log("Password: ", password);

    if (!playerName) {
      openModal();
    } else {
      console.log(`Auto-joining room: ${roomID}`);
      handleJoinRoom(playerName, password);
    }
  }, [isConnected]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleJoinRoom = (playerName: string, password: string | undefined) => {
    const token = sessionStorage.getItem("token") || undefined;
    console.log("Joining room...");
    console.log("Name: ", playerName);
    if (isConnected) {
      console.log(`Joining room: ${roomID}`);
      socket &&
        socket.emit("joinRoom", { roomID, playerName, password, token });
    }
  };

  const handlePlayMove = (clickedCell: Cell) => {
    console.log("Playing move...");
    console.log(clickedCell);
    socket.emit("playerMove", { roomID, clickedCell });
  };

  const restartGame = () => {};

  return (
    <div>
      {isWaitingForPlayer ? (
        <div
          style={{
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1>Waiting for players</h1>
          <Loader />
          {visibility === "private" && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>
                Send the link to a friend
              </h3>
              <div
                className="fake-input"
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <h4>{window.location.href}</h4>
                <button
                  className="icon-button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : state && currentPlayer ? (
        <div style={{ flex: 1 }}>
          <TopBar currentPlayer={currentPlayer} players={players} />
          <Board
            gameState={state}
            handlePlay={handlePlayMove}
            restartGame={restartGame}
          />
        </div>
      ) : (
        <div
          style={{
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1>Loading</h1>
          <Loader />
        </div>
      )}
      {isModalOpen && (
        <NameModal
          handleJoinRoom={handleJoinRoom}
          closeModal={closeModal}
          requirePassword={visibility === "private"}
        />
      )}
    </div>
  );
}
