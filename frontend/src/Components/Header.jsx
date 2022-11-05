import { Button } from "@mui/material";
import React from "react";

export default function Header({ page, goBack }) {
  return (
    <div
      style={{
        width: "100%",
        height: "75px",
        backgroundColor: "black",
        fontSize: "50px",
        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
        paddingTop: "10px",
        color: "white",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          margin: "auto",
          width: "100%",
          textAlign: "center",
          top: 10,
          fontWeight: "500",
        }}
      >
        Crawl Route Generator
      </div>
      <div style={{ width: "fit-content", paddingLeft: "30px" }}>
        {page > 1 && (
          <Button onClick={goBack} variant="contained">
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}
