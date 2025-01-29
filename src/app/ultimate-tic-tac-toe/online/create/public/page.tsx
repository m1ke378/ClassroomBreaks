"use client";

import BaseCard from "@/components/BaseCard/BaseCard";
import "@/styles/create.css";
import CreateRoomClient from "@/components/CreateRoomClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NameModal from "@/components/NameModal/NameModal";

export default function CreateOnlinePublicGamePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    throw new Error("API_URL is not defined");
  }
  const [rooms, setRooms] = useState([]);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_URL}/public-rooms`);
        const data = await response.json();
        console.log(data);
        setRooms(data.publicRooms);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  const openModal = (roomId: string) => {
    setSelectedRoom(roomId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleJoinRoom = (playerName: string) => {
    if (playerName.trim() && selectedRoom) {
      router.push(
        `/ultimate-tic-tac-toe/online/${selectedRoom}?player-name=${playerName}`
      );
    }
  };

  return (
    <div className="create-page">
      <BaseCard>
        <h3 className="title">Join a room</h3>
        <div className="rooms-list">
          {rooms && rooms.length > 0 ? (
            rooms.map((room: any, index: number) => {
              console.log(room);
              return (
                <div
                  className="room"
                  key={index}
                  onClick={() => openModal(room.roomId)}
                >
                  <span>{room.hostName}</span>
                </div>
              );
            })
          ) : (
            <div className="noRooms">No rooms available</div>
          )}
        </div>
      </BaseCard>
      <BaseCard>
        <h3 className="title">Create public room</h3>
        {/* Include the client component */}
        <CreateRoomClient />
      </BaseCard>

      {isModalOpen && (
        <NameModal handleJoinRoom={handleJoinRoom} closeModal={closeModal} />
      )}
    </div>
  );
}
