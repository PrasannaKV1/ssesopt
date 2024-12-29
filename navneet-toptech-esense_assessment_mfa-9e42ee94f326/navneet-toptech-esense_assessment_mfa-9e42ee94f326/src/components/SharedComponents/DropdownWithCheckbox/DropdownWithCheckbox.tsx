import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import FilterIcon from '../../../assets/images/FilterIcon.svg';
import "./DropdownWithCheckbox.css";
import "../SelectBoxComponent/SelectBoxComponent.css"

interface Props {
    variant: string;
    selectedValue: string;
    clickHandler: (e: any) => void;
    selectLabel: string;
    selectList: any[];
    mandatory: boolean;
    disabled?: boolean;
    registerName: string;
    showableLabel: any;
    showableData: any;
    menuHeader?: string;
    value: any;
    required: boolean;
    setpostObj?: (e:any)=>void;
    preSetVal?: any;
    resetObj?: any;
    setCompval?:(e:any)=>void;
    trigger?:boolean;
    flag?:boolean
};

const DropdownWithCheckbox: React.FC<Props> = ({ variant,trigger,setCompval, value, showableLabel, showableData, required, clickHandler, selectLabel, selectList, mandatory, disabled, registerName, menuHeader, selectedValue, preSetVal, setpostObj, resetObj,flag }) => {
    const { register, reset, unregister, getValues, control, setValue } = useFormContext();
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [prevSelected, setPrevSelected] = useState<any[]>([]);
    const [isSelectFocused, setIsSelectFocused] = useState(false);
    const handleSelectAll = () => {
      if (selectedOptions.length === selectList.length) {
        if (resetObj?.isChange) {
          setPrevSelected([]);
          clickHandler(getValues(registerName));
        } else {
          setSelectedOptions([]);
          clickHandler([]);
          resetObj?.setIsContinue(false);
        }
      } else {
        if (resetObj?.isChange) {
          setPrevSelected(selectList.map((option: any) => option?.[showableData]));
          clickHandler(getValues(registerName));
        } else {
          setSelectedOptions(
            selectList.map((option: any) => option?.[showableData])
          );
          clickHandler(selectList.map((option: any) => option?.[showableData]));
          resetObj?.setIsContinue(false);
        }
      }
    };

    const handleOptionToggle = (value: any) => () => {
        const currentIndex = selectedOptions?.indexOf(value);
        const newSelectedOptions = [...selectedOptions];

        if (currentIndex === -1) {
            newSelectedOptions?.push(value);
        } else {
            newSelectedOptions?.splice(currentIndex, 1);
        }
            if(resetObj?.isChange){
                setPrevSelected(newSelectedOptions)
                clickHandler(getValues(registerName))
            }else{
                setSelectedOptions(newSelectedOptions);
                clickHandler(newSelectedOptions)
                resetObj?.setIsContinue(false)
            }

    };

    useEffect(()=>{
        if(resetObj?.isContinue){
            setSelectedOptions(prevSelected)
            clickHandler(prevSelected);
            resetObj?.setIsContinue(false)
        }
    },[resetObj?.isContinue])

    const handleClearSelection = () => {
        if (resetObj?.isChange) {
            setPrevSelected([]);
            clickHandler(getValues(registerName));
          } else {
            setSelectedOptions([]);
            clickHandler([])
            resetObj?.setIsContinue(false);
          }
            
    };

    const getSelectedText = () => {
        if (selectedOptions.length === 0) {
            return "";
        } else if (selectedOptions.length === selectList.length) {
            return "All";
        } else {
            return `${selectedOptions.length} selected`;
        }
    };

    React.useEffect(() => {
        if (preSetVal?.[registerName] && selectList.length > 0) {
            const initSel: any = selectList?.filter((ele: any) => {
                return preSetVal[registerName]?.find((reg: any) => +reg == ele[showableData])
            }).map((res: any) => res?.[showableData])
                setSelectedOptions(initSel)
                setValue(registerName, initSel)
                setpostObj && setpostObj((pre: any) => ({ ...pre, [registerName]: initSel }))
                setCompval && setCompval((prev:any)=>({...prev,[registerName]: initSel}))
        }else {
            setSelectedOptions([])
        }
    }, [preSetVal?.[registerName], selectList,trigger])

    useEffect(()=>{
        if(value.length>0){
            setSelectedOptions(value)
        }else{
            setSelectedOptions([])
        }
    },[value])

    const handleSelectFocus = () => {
        setIsSelectFocused(true);
    };

    const handleSelectBlur = () => {
        setIsSelectFocused(false);
    };

    function extractContent(s:any) {
        var span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
      };

    return (
        <div className={variant == "fill" ? "selectMultiFillType" : "selectTransparentType"}>
            <Controller
                name={registerName}
                
                control={control}
                render={({ field: { onChange, value, ref } }) => {
                    return (
                        <FormControl fullWidth>
                            <InputLabel>{selectLabel}{mandatory ? "*" : ""}
                            <span>
                            {!selectedOptions.length && !isSelectFocused && flag ? ": Click to Select" : ""}
                        </span></InputLabel>
                            <Select
                                multiple
                                value={selectedOptions}
                                renderValue={getSelectedText}
                                label={selectLabel}
                                disabled={disabled}
                                onBlur={handleSelectBlur}
                                onFocus={handleSelectFocus}
                                MenuProps={{
                                    // getContentAnchorEl: null,
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                    }
                                }}
                            >
                                {selectList?.length > 0 ?
                                    <>
                                        <MenuItem className="dropDownWithExpanField" onClick={() => { handleClearSelection();}}>
                                            <img src={FilterIcon} style={{ paddingRight: "13px" }} /> Clear Selection
                                        </MenuItem>
                                        <MenuItem className="dropDownWithExpanField">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedOptions.length === selectList.length}
                                                        onChange={() => { handleSelectAll(); }}
                                                    />
                                                }
                                                label="Select All"
                                            />
                                        </MenuItem>
                                        {selectList.map((option) => (
                                            <MenuItem className="dropDownWithExpanField" key={option[showableData]}  onClick={()=>{handleOptionToggle(option[showableData])}}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedOptions.indexOf(option[showableData]) !== -1}
                                                            onChange={handleOptionToggle(option[showableData])}
                                                        />
                                                    }
                                                    label={extractContent(option[showableLabel])}
                                                />
                                            </MenuItem>
                                        ))}
                                    </>
                                    : <MenuItem className="dropDownWithExpanField" disabled style={{ background: 'none' }}>No Items Available</MenuItem>}
                            </Select>
                        </FormControl>)
                }} />
        </div>
    );
};

export default DropdownWithCheckbox;
