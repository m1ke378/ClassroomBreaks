"use client";

import Board from "@/components/Board/Board";
import TopBar from "@/components/TopBar/TopBar";
import { use, useEffect, useState } from "react";
import socket, { connectSocket, disconnectSocket } from "@/lib/socket";
import { Cell, Player, Players } from "@/utils/types";
import NameModal from "@/components/NameModal/NameModal";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { error } from "console";
import ErrorModal from "@/components/ErrorModal/ErrorModal";

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
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (connectSocket()) setIsConnected(true);

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("error", (error) => {
      setErrorMessage(error);
      openErrorModal();
      setTimeout(() => {
        closeErrorModal();
      }, 2000);
      router.push(`/ultimate-tic-tac-toe`);
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

    socket.on("player2Left", () => {
      console.log("Guest player left");
      setErrorMessage("Player 2 left the game");
      openErrorModal();
      setTimeout(() => {
        closeErrorModal();
      }, 1000);
      setIsWaitingForPlayer(true);
      setPlayers(null);
      setCurrentPlayer(null);
      setState(null);
    });

    socket.on("hostLeft", () => {
      console.log("Host left the game");
      router.push(`/ultimate-tic-tac-toe`);
    });

    socket.on("passwordError", () => {
      console.log("Incorrect or missing password");
      setErrorMessage("Incorrect or missing password");
      openErrorModal();
      setTimeout(() => {
        closeErrorModal();
        openModal();
      }, 1000);
    });

    return () => {
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

  const openErrorModal = () => {
    setIsErrorModalOpen(true);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleJoinRoom = (playerName: string, password: string | undefined) => {
    console.log("Joining room...");
    console.log("Name: ", playerName);
    if (isConnected) {
      console.log(`Joining room: ${roomID}`);
      socket &&
        socket.emit("joinRoom", { roomID, playerName: playerName, password });
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

      {isErrorModalOpen && <ErrorModal errorMessage={errorMessage} />}
    </div>
  );
}
