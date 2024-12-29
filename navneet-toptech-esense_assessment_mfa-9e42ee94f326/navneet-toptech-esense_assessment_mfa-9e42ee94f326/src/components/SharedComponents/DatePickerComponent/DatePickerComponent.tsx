import React, { FC } from "react";
import Box from "@mui/material/Box";
import "./DatePickerComponent.css";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type props={
    datetitle:string
}
const DatePickerComponent:FC<props> = ({datetitle}) => {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  return (
    <>
      <Box className="datePickerComponentstyling">
        <p style={{width:"75px"}}>{datetitle}</p>
        <Box >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={value}
            inputFormat='DD/MM/YYYY'
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField 
              {...params} 
            inputProps={{
              ...params.inputProps,
              placeholder: 'DD/MM/YYYY'
            }}
            />}
          />
        </LocalizationProvider>
        </Box>
      </Box>
    </>
  );
};

export default DatePickerComponent;
