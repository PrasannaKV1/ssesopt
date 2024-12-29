import React from "react";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import Box from "@mui/material/Box";
import "./TimePickerComponent.css";

const TimePickerComponent = () => {
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs("")
  );

  return (
    <>
    <Box className="timePickerComponenstyling">
    <p>Time</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={value}
          onChange={setValue}
          renderInput={(params) => <TextField {...params} 
          inputProps={{
            ...params.inputProps,
            placeholder: "HH:MM pm"
          }}
          />}
        />
      </LocalizationProvider>
      </Box>
    </>
  );
};

export default TimePickerComponent;
