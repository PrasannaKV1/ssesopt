import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useFormContext, Controller } from "react-hook-form"
import "../SelectBoxComponent/SelectBoxComponent.css"
import FormHelperText from '@mui/material/FormHelperText';

interface Props {
    variant: string;
    selectedValue: string;
    clickHandler?: (e: any) => void;
    selectLabel: string;
    selectList: any[];
    mandatory: boolean;
    disabled?: boolean;
    registerName: string;
    showableLabel?: string;
    showableData?: string;
    menuHeader?:string;
};

const SelectBoxComponentForForm: React.FC<Props> = ({ variant, selectedValue, clickHandler, selectLabel, selectList, mandatory, disabled, registerName, showableData, showableLabel,menuHeader }) => {
    const { register, reset, unregister, getValues, control } = useFormContext();
    const [validation, setValidation] = useState(mandatory ? { required: "This field is Required" } : {})

    const handleChange = (event: SelectChangeEvent) => {
        if (!showableData) {
            clickHandler && clickHandler(selectList.indexOf(event.target.value))
        } else {
            clickHandler && clickHandler(selectList.indexOf(selectList.find((ele: any) => ele[showableData] === event.target.value)))
        }
    };

    return (
        <div className={variant == "fill" ? "selectFillType" : "selectTransparentType"}>
            <Controller
                name={registerName}
                rules={validation}
                control={control}
                render={({ field: { onChange, value, ref } }) => {
                    return (
                        <FormControl sx={{ m: 1 }}>
                            <InputLabel>{selectLabel}{mandatory ? "*" : ""}</InputLabel>
                            <Select
                                inputRef={ref}
                                IconComponent={variant == "fill" ? ArrowDropDownIcon : KeyboardArrowDownIcon}
                                value={getValues(registerName)? getValues(registerName) : selectedValue} 
                                label={selectLabel}
                                displayEmpty
                                disabled={disabled}
                                inputProps={{ "aria-label": "Without label" }}
                                notched={true}
                                // placeholder={menuHeader}
                                // required={mandatory}
                                onChange={(e) => { handleChange(e); onChange(e.target.value) }}
                            >
                                {/* <MenuItem disabled value="">{menuHeader}</MenuItem> */}
                                {selectList?.length ? selectList.map((ele: any, index: number) => {
                                    return <MenuItem value={showableData ? ele[showableData] : ele} key={index}>{showableLabel ? ele[showableLabel] : ele}</MenuItem>
                                }) :
                                    <MenuItem value={undefined} disabled>No Items Available</MenuItem>
                                }
                            </Select>
                        </FormControl>
                    )
                }}
            />
        </div>
    );
};

export default SelectBoxComponentForForm;