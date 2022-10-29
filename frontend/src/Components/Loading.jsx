import { CircularProgress } from "@mui/material";
import React from "react";

export default function Loading({ message }) {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "90vh" }}>
      <div>
        <CircularProgress size={150} />
        {message && (
          <div style={{ fontSize: "20px", paddingTop: "20px" }}>{message}</div>
        )}
      </div>
    </div>
  );
}
