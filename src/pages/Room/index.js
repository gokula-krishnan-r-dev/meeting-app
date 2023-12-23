import { useParams } from "react-router";
import useWebRTC, { LOCAL_VIDEO } from "../../hooks/useWebRTC";
import { useState } from "react";

function layout(clientsNumber = 1) {
  const pairs = Array.from({ length: clientsNumber }).reduce(
    (acc, next, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }

      return acc;
    },
    []
  );

  const rowsNumber = pairs.length;
  const height = `${100 / rowsNumber}%`;

  return pairs
    .map((row, index, arr) => {
      if (index === arr.length - 1 && row.length === 1) {
        return [
          {
            width: "100%",
            height,
          },
        ];
      }

      return row.map(() => ({
        width: "50%",
        height,
      }));
    })
    .flat();
}

export default function Room() {
  const { id: roomID } = useParams();
  const { clients, provideMediaRef } = useWebRTC(roomID);
  const videoLayout = layout(clients.length);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const handleToggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
    // toggleMute(); // Call your function to handle mute in useWebRTC
  };

  const handleToggleCamera = () => {
    setIsCameraOff((prevCameraOff) => !prevCameraOff);
    // toggleCamera(); // Call your function to handle camera off in useWebRTC
  };

  const handleEndMeeting = () => {
    // endMeeting(); // Call your function to end the meeting in useWebRTC
    // Add any other necessary cleanup or navigation logic here
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        height: "100vh",
      }}
    >
      {/* Mute Button */}

      {clients.map((clientID, index) => {
        return (
          <div key={clientID} style={videoLayout[index]} id={clientID}>
            <video
              width="100%"
              height="100%"
              ref={(instance) => {
                provideMediaRef(clientID, instance);
              }}
              autoPlay
              playsInline
              muted={clientID === LOCAL_VIDEO} // Apply mute status
            />
            <button onClick={handleToggleMute}>
              {isMuted ? "Unmute" : "Mute"}
            </button>

            {/* Camera Visibility Toggle */}
            <button onClick={handleToggleCamera}>
              {isCameraOff ? "Show Camera" : "Hide Camera"}
            </button>

            {/* End Meeting Button */}
            <button onClick={handleEndMeeting}>End Meeting</button>
          </div>
        );
      })}
    </div>
  );
}
