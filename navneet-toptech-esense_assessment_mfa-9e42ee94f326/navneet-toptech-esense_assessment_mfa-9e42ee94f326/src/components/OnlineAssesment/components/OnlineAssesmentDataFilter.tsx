import React from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import TextField, { TextFieldProps } from "@mui/material/TextField";

interface DateFilterProps extends Omit<DatePickerProps<Date, Date>, 'renderInput'> {
    label: string;
    value: Date | null;
    onChange: (newValue: Date | null) => void;
    backgroundColor?: string; // Optional background color
    width?: number; // Optional width
    disabled?: boolean
    borderRadius?: boolean
}

const OnlineAssesmentDataFilter: React.FC<DateFilterProps> = ({ label, value, onChange, backgroundColor, width, ...props }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                {...props}
                label={label}
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField {...params} style={{ backgroundColor: backgroundColor || "white", width: width, minWidth: width, borderRadius: props.borderRadius ? "6px" : "" }} />}
                disabled={props.disabled}
            />
        </LocalizationProvider>
    );
};

export default OnlineAssesmentDataFilter;
