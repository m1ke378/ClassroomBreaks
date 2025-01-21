import BaseCard from "@/components/BaseCard/BaseCard";
import "@/styles/create.css";

export default function CreateOnlinePrivateGamePage() {
  return (
    <div className="create-page">
      <BaseCard>
        <h3 className="title">Create a room</h3>
        <div className="input-container">
          <label htmlFor="player1input">Name</label>
          <input type="text" id="player1input" placeholder="John" />
        </div>
      </BaseCard>
      <button className="submit-button">Create</button>
    </div>
  );
}
