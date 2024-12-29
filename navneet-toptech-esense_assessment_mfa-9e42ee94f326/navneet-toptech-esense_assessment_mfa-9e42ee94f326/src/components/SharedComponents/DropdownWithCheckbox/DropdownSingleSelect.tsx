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
import FilterIcon from '../../../assets/images/FilterIcon.svg';


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
    showableLabel2?: any
    SectionDisabledID?: any
};

const DropdownSingleSelect: React.FC<Props> = ({ variant, selectedValue, clickHandler, selectLabel, selectList, mandatory, disabled, registerName, showableData, showableLabel, menuHeader, showableLabel2, SectionDisabledID }) => {
    const { register, reset, unregister, getValues, control,setValue } = useFormContext();
    const [validation, setValidation] = useState(mandatory ? { required: "This field is Required" } : {})
    const [testMarks, setTestMarks] = useState(false)

    const handleChange = (event: SelectChangeEvent) => {
        if (!showableData) {
            clickHandler && clickHandler(selectList.indexOf(event.target.value))
        } else {
            clickHandler && clickHandler(selectList.indexOf(selectList.find((ele: any) => ele[showableData] === event.target.value)))
        }
    };
    const handleClearSelection = () => {
        // setValue(registerName,[])
        clickHandler && clickHandler(null)
    };

    useEffect(() => {
        if (selectList && selectList.length && selectList[0]?.testTypeDisplayName && showableLabel2) {
            setTestMarks(true)
        }
    }, [selectList])
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
                                onChange={(e) => { handleChange(e) }}
                                MenuProps={{className:"SectionMenuForStdList"}}
                            >
                                {/* <MenuItem disabled value="">{menuHeader}</MenuItem> */}
                                <MenuItem onClick={handleClearSelection}>
                    <img src={FilterIcon} style={{paddingRight:"13px"}}/> Clear Selection
                </MenuItem>
                                {selectList?.length ? selectList.map((ele: any, index: number) => {
                                    const isDisabled = SectionDisabledID?.includes(ele?.sectionID);
                                    return <MenuItem disabled={isDisabled} value={showableData ? ele[showableData] : ele} key={index}>{showableLabel ? testMarks ? `${ele[showableLabel]} - ${ele[showableLabel2]}` : ele[showableLabel] : ele}</MenuItem>
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

export default DropdownSingleSelect;