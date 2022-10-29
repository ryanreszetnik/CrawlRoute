import * as React from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function CustomTimePicker({ label, onChange }) {
  const [value, setValue] = React.useState(dayjs("2022-10-20T21:00:00"));

  const handleChange = (newValue) => {
    setValue(newValue);
    onChange(newValue["$H"], newValue["$m"]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} sx={{ margin: "15px" }} />
        )}
      />
    </LocalizationProvider>
  );
}
