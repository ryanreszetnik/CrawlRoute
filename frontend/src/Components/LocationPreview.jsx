import React from "react";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ReplayIcon from "@mui/icons-material/Replay";
export default function LocationPreview({
  location,
  stopNumber = null,
  disableDouble = false,
  timeAtStop = null,
  overlapTimes = [],
}) {
  return (
    <div
      style={{
        maxWidth: "150px",
        backgroundColor: location.first
          ? "green"
          : location.last
          ? "red"
          : "#555",
        color: "white",
        padding: "10px",
        margin: "10px",
        borderRadius: "10px",
        fontSize: "0.75rem",
        position: "relative",
      }}
    >
      {stopNumber !== null && (
        <div
          style={{
            position: "absolute",
            bottom: -15,
            left: 0,
            color: "black",
            width: "100%",
            maxWidth: "150px",
          }}
        >
          Stop {stopNumber}
          {location.double && `, ${stopNumber + 1}`}
        </div>
      )}
      <div>{location.name}</div>
      {location.food && <RestaurantIcon />}
      {location.double && !disableDouble && <ReplayIcon />}
      {timeAtStop && <div>{timeAtStop}</div>}
      {overlapTimes.map((time, i) => (
        <div style={{ color: "red" }}>{time} min</div>
      ))}
    </div>
  );
}
