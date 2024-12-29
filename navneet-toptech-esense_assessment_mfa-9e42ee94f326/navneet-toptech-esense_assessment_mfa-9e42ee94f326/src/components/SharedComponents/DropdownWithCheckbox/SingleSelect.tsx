import React, { useState } from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import FilterIcon from '../../../assets/images/FilterIcon.svg';

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
    trigger?:boolean
};
const SingleSelect: React.FC<Props>  = ({ variant,trigger,setCompval, value, showableLabel, showableData, required, clickHandler, selectLabel, selectList, mandatory, disabled, registerName, menuHeader, selectedValue, preSetVal, setpostObj, resetObj }) => {
    const { register, reset, unregister, getValues, control, setValue } = useFormContext();
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    const handleClearSelection = () => {
        setSelectedOptions([]);
        clickHandler([])
    };

    const getSelectedText = () => {
        if (selectedOptions.length === 0) {
            return "";
        } else {
            return selectList?.filter((x:any)=>x?.[showableData] === selectedOptions)?.[0]?.[showableLabel] ;
        }
    };

    const changeHandler = (val:any) => {
        setSelectedOptions(val);
        clickHandler([val])
    }

    React.useEffect(() => {
        if (preSetVal?.[registerName] && selectList.length > 0) {
            const initSel: any = selectList?.filter((ele: any) => {
                return preSetVal[registerName]?.find((reg: any) => +reg == ele[showableData])
            }).map((res: any) => res?.[showableData])
                setSelectedOptions(initSel[0])
                setValue(registerName, initSel)
                setpostObj && setpostObj((pre: any) => ({ ...pre, [registerName]: initSel}))
                setCompval && setCompval((prev:any)=>({...prev,[registerName]: initSel}))
        } else {
            setSelectedOptions([])
        }
    }, [preSetVal?.[registerName], selectList,trigger])

    return (
        <div className={variant == "fill" ? "selectMultiFillType" : "selectTransparentType"}>
            <Controller
                name={registerName}
                control={control}
                render={({ field: { onChange, value, ref } }) => {
                    return (
                        <FormControl fullWidth>
                            <InputLabel>{selectLabel}</InputLabel>
            <Select
                value={selectedOptions}
                renderValue={getSelectedText}
                label={selectLabel}
                disabled={disabled}
                MenuProps={{
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
                <MenuItem className="dropDownWithExpanField" onClick={() => { handleClearSelection();}}>
                                            <img src={FilterIcon} style={{ paddingRight: "13px" }} /> Clear Selection
                                        </MenuItem>
                {selectList.map((option) => (
                    <MenuItem className="dropDownWithExpanField" key={option[showableData]} onClick={()=>{changeHandler(option[showableData])}}>
                        {option[showableLabel]}
                    </MenuItem>
                ))}
            </Select>
            </FormControl>)
               }} />
        </div>
    );
};

export default SingleSelect;