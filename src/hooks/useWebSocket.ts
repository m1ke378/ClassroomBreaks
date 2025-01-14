import { useEffect } from "react";
import socket from "@/lib/socket";

const useWebSocket = (roomID: string) => {
  useEffect(() => {
    socket.emit("joinRoom", roomID);

    return () => {
      socket.emit("leaveRoom", roomID);
    };
  }, [roomID]);

  return socket;
};

export default useWebSocket;
