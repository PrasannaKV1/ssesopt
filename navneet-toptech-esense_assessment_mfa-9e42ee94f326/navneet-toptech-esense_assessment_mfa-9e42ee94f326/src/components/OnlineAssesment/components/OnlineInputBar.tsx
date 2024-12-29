import React, { FunctionComponent } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type InputBarProps = {
    className?: string;
    label: string;
    value: string;
    onChange: (newValue: string) => void;
    isDisable?: boolean
};

const InputBar: FunctionComponent<InputBarProps> = ({
    className = "",
    label,
    value,
    onChange,
    isDisable
}) => {
    return (
        <div
            style={{
                width: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                lineHeight: "normal",
                letterSpacing: "normal",
                textAlign: "left",
                fontSize: "14px",
                color: "#9a9a9a",
                fontFamily: "Manrope",
            }}
            className={className}
        >
            <div
                style={{
                    alignSelf: "stretch",
                    height: "52px",
                    borderRadius: "8px",
                    backgroundColor: "#fcfcfd",
                    border: "1px solid #dedede",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    //   padding: "16px 11px",
                }}
            >
                <div style={{ alignSelf: "stretch", flex: "1" }}>
                    <div
                        style={{
                            alignSelf: "stretch",
                            flex: "1",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            //   gap: "2px",
                        }}
                    >
                        <a
                            style={{
                                textDecoration: "none",
                                position: "relative",
                                fontWeight: "500",
                                color: "inherit",
                                display: "inline-block",
                                minWidth: "59px",
                                padding: "16px 11px",
                            }}
                        >
                            {label}:
                        </a>
                        <Select
                            value={value}
                            // variant={"standard"}
                            onChange={(e) => onChange(e.target.value as string)}
                            sx={{
                                alignSelf: "stretch",
                                flex: "1",
                                position: "relative",
                                fontWeight: "600",
                                color: "#1b1c1e",
                                border: "none",
                                outline: "none",
                                backgroundColor: "transparent",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                                fontFamily: "Manrope",
                               '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' }
                            }}
                            className="demo123"
                            disabled={isDisable}
                        >
                            {/* Replace with your options */}
                            <MenuItem value="All Chapters">All Chapters</MenuItem>
                            <MenuItem value="Chapter 1">Chapter 1</MenuItem>
                            <MenuItem value="Chapter 2">Chapter 2</MenuItem>
                            {/* Add more MenuItems as needed */}
                        </Select>
                    </div>
                    <img
                        style={{
                            height: "12px",
                            width: "12px",
                            position: "relative",
                            overflow: "hidden",
                            flexShrink: "0",
                        }}
                        alt=""
                        src="/frame-28359.svg"
                    />
                </div>
            </div>
        </div>
    );
};

export default InputBar;
