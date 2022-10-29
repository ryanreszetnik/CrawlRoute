import { Box, Slider, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";

const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: 42,
    backgroundColor: "unset",
    color: theme.palette.text.primary,
    "&:before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  },
  "& .MuiSlider-mark": {
    backgroundColor: "#bfbfbf",
    height: 10,
    width: 2,

    "&.MuiSlider-markActive": {
      opacity: 1,
      backgroundColor: "currentColor",
    },
  },
}));

export default function SliderInput({
  label,
  value,
  setValue,
  min,
  max,
  isTime = false,
  step = 1,
  rightLabel = "",
  marks = false,
}) {
  const [error, seterror] = useState(null);
  const getLabelValue = (value) => {
    if (isTime) {
      const hrs = Math.floor(value / 60);
      const min = value % 60;
      if (hrs === 0) {
        return `${min} min`;
      }
      return `${hrs} hr ${min} min`;
    }
    return value;
  };
  useEffect(() => {
    if (max >= value && value >= min) {
      seterror(null);
      return;
    }
    if (max == min) {
      if (value != min) {
        setValue(min);
      }
      return;
    }
    if (value < min) {
      seterror("Invalid value");
    }
  }, [max, min, value]);
  return (
    <Box
      sx={{
        width: "calc(30%-10px)",
        minWidth: "calc(30%-10px)",
        backgroundColor: "#ddd",
        padding: "5px 15px 18px 20px",
        margin: "10px",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minWidth: "150px",
          display: "flex",
        }}
      >
        <Typography sx={{ flexGrow: 1, textAlign: "start", fontSize: "1.2em" }}>
          {label}
        </Typography>
        <Typography sx={{ color: "#00000088" }}>{rightLabel}</Typography>
      </Box>
      <Box sx={{ margin: "0 20px 0 15px" }}>
        {max > min && (
          <StyledSlider
            step={step}
            size="small"
            min={min}
            max={max}
            valueLabelDisplay="on"
            value={value}
            onChange={(_, v) => setValue(v)}
            getAriaValueText={getLabelValue}
            valueLabelFormat={getLabelValue}
            marks={marks}
          />
        )}
        {max === min && <div>{value}</div>}
        {error && <div>{error}</div>}
      </Box>
    </Box>
  );
}
