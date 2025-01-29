"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketIOOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onMessage?: (event: any) => void;
}

export const useWebSocket = (url: string, options: UseSocketIOOptions = {}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(url, {
      transports: ["websocket"], // Ensures WebSocket-only connection
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      options.onConnect?.();
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      options.onDisconnect?.();
    });

    newSocket.on("error", (error) => {
      options.onError?.(error);
    });

    newSocket.on("message", (event) => {
      options.onMessage?.(event);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  const sendMessage = (event: string, data: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  return {
    sendMessage,
    isConnected,
    socket,
  };
};
