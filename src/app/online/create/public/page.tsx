import BaseCard from "@/components/BaseCard/BaseCard";
import "@/styles/create.css";
import { faHome, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CreateOnlinePublicGamePage() {
  return (
    <div className="create-page">
      <BaseCard>
        <h3 className="title">Join a room</h3>
        <div className="rooms-list">
          <div className="room">
            <span>Mike</span>
          </div>
          <div className="room">
            <span>Jade</span>
          </div>
          <div className="room">
            <span>Kim</span>
          </div>
        </div>
      </BaseCard>
      <div>
        <BaseCard>
          <h3 className="title">Create public room</h3>
          <div className="input-container">
            <label htmlFor="player1input">Name</label>
            <div className="input-button-wrapper">
              <input type="text" id="player1input" placeholder="John" />
              <button className="submit-button">Create</button>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
