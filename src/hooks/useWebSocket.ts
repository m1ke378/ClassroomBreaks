import { useEffect, useRef, useState } from "react";

interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
}

export const useWebSocket = (
  url: string,
  options: UseWebSocketOptions = {}
) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  const connect = () => {
    if (
      !socketRef.current ||
      socketRef.current.readyState >= WebSocket.CLOSING
    ) {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = (event) => {
        setIsConnected(true);
        options.onOpen?.(event);
      };

      socket.onmessage = (event) => {
        options.onMessage?.(event);
      };

      socket.onclose = (event) => {
        setIsConnected(false);
        options.onClose?.(event);
      };

      socket.onerror = (event) => {
        options.onError?.(event);
      };
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [url]);

  return {
    sendMessage,
    isConnected,
    connect,
    disconnect,
    socket: socketRef.current,
  };
};
