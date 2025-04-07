"use client";

import CreateRoomClient from "@/components/CreateRoomClient";
import BaseCard from "@/components/BaseCard/BaseCard";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "@/styles/create.css"; // Assuming you have a CSS file for styles

export default function CreateRoomPage() {
  const { visibility } = useParams(); // public or private
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const roomIDRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (visibility === "public") {
      const fetchRooms = async () => {
        try {
          const res = await fetch(`${API_URL}/public-rooms`);
          const data = await res.json();
          console.log("Public rooms:", data);
          setRooms(data.publicRooms);
        } catch (err) {
          console.error(err);
        }
      };
      fetchRooms();
    }
  }, [visibility]);

  const handleJoinRoom = (selectedRoom: string) => {
    router.push(`/ultimate-tic-tac-toe/online/${visibility}/${selectedRoom}`);
  };

  return (
    <div className="create-page">
      {visibility === "public" && (
        <BaseCard>
          <h3 className="title">Join a room</h3>
          <div className="rooms-list">
            {rooms.length > 0 ? (
              rooms.map((room: { roomID: string; hostName: string }, index) => (
                <div
                  className="room"
                  key={index}
                  onClick={() => handleJoinRoom(room.roomID)}
                >
                  <span>{room.hostName}</span>
                </div>
              ))
            ) : (
              <div className="noRooms">No rooms available</div>
            )}
          </div>
        </BaseCard>
      )}

      {visibility === "private" && (
        <BaseCard>
          <h3 className="title">Join a room</h3>
          <div className="input-container-inline">
            <input
              ref={roomIDRef}
              placeholder="Room ID"
              type="text"
              autoComplete="off"
            />
            <button
              className="submit-button"
              onClick={() => {
                const roomID = roomIDRef.current?.value;
                if (roomID) {
                  handleJoinRoom(roomID.toLocaleLowerCase());
                }
              }}
            >
              Join
            </button>
          </div>
        </BaseCard>
      )}

      <BaseCard>
        <h3 className="title">
          Create {visibility === "public" ? "Public" : "Private"} Room
        </h3>
        <CreateRoomClient isPrivate={visibility === "private"} />
      </BaseCard>
    </div>
  );
}
