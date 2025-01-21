import BaseCard from "@/components/BaseCard/BaseCard";
import "@/styles/create.css";
import CreateRoomClient from "@/components/CreateRoomClient";

export default async function CreateOnlinePublicGamePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch rooms
  let rooms = [];
  try {
    const response = await fetch(`${API_URL}/public-rooms`);
    const data = await response.json();
    console.log(data);
    rooms = data.publicRooms;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="create-page">
      <BaseCard>
        <h3 className="title">Join a room</h3>
        <div className="rooms-list">
          {rooms &&
            rooms.map((room: any) => {
              const roomData = JSON.parse(room);
              return (
                <div className="room" key={room.id}>
                  <span>{roomData.hostName}</span>
                </div>
              );
            })}
        </div>
      </BaseCard>
      <div>
        <BaseCard>
          <h3 className="title">Create public room</h3>
          {/* Include the client component */}
          <CreateRoomClient />
        </BaseCard>
      </div>
    </div>
  );
}
