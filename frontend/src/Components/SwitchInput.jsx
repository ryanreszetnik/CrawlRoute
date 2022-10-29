import { Box, Slider, Switch, Typography } from "@mui/material";
import React from "react";

export default function SwitchInput({ label, value, setValue }) {
  return (
    <Box sx={{ width: 400, padding: 1, display: "flex" }}>
      <Typography
        sx={{
          width: 200,
          textAlign: "end",
          paddingRight: 3,
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        {label}
      </Typography>
      <Switch
        sx={{ marginTop: "auto", marginBottom: "auto" }}
        value={value}
        onChange={(_, v) => setValue(v)}
      />
    </Box>
  );
}
