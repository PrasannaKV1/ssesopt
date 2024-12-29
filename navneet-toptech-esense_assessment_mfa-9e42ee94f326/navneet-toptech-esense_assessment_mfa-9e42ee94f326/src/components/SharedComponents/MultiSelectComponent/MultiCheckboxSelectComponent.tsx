// import "./styles.css";
import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    ListSubheader,
    TextField,
    ListItemText,
    Checkbox,
    SelectChangeEvent
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

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
    value:any;
    required:boolean;
    preSetVal:any
};

const MultiCheckboxSelectComponent: React.FC<Props> = ({ variant,value, showableLabel,showableData,required,preSetVal, clickHandler, selectLabel, selectList, mandatory, disabled, registerName, menuHeader }) => {
    const [selectedOption, setSelectedOption] = useState<any>([]);   
    const { register, reset, unregister, getValues, control,setValue } = useFormContext();
    const [validation, setValidation] = useState(required ? { required: "This Field is Required" } : {})

    const handleChange = (event: SelectChangeEvent) => {
        const {
            target: { value },
        } = event;
        setSelectedOption(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        clickHandler(typeof value === 'string' ? value.split(',') : value)
    };

    useEffect(()=>{
        if(value?.length == 0){
            setSelectedOption([])
        }
    },[value])

    React.useEffect(() => {
        if (preSetVal?.[registerName] && selectList.length > 0) {
            const initSel: any = selectList?.filter((ele: any) => {
                return preSetVal[registerName]?.find((reg: any) => +reg == ele[showableData])
            }).map((res: any) => res?.[showableData])
            if (initSel.length > 0) {
                setSelectedOption(initSel)
                setValue(registerName, initSel)
                // setpostObj((pre: any) => ({ ...postObj, registerName: initSel }))
            }
        } else {
            setSelectedOption([])
        }
    }, [preSetVal?.[registerName], selectList])
    

    return (
        <div className={variant == "fill" ? "selectFillType" : "selectTransparentType"}>
            <Controller
                name={registerName}
                rules={validation}            
                control={control}
                render={({ field: { onChange, value, ref } }) => {
                    return (
                        <FormControl fullWidth>
                            <InputLabel>{selectLabel}{mandatory ? "*" : ""}</InputLabel>
                            <Select
                                inputRef={ref}   
                                value={getValues(registerName) && getValues(registerName) }
                                label={selectLabel}
                                disabled={disabled}
                                multiple
                                onChange={(e:any)=>{handleChange(e);onChange(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}}
                                renderValue={() => { return (
                                    <div className="d-flex justify-content-between">
                                        <div> {selectedOption?.length > 0 && `${selectList?.filter((x:any,i:number)=> x?.[showableData] == selectedOption[0] && x?.[showableLabel] )[0]?.[showableLabel]}`}</div>
                                        <div> {(selectedOption?.length - 1 > 0 ) ? `+ ${selectedOption?.length - 1}`  : ''}</div>
                                    </div>
                                )}}
                            >                                                         
                                {selectList?.length > 0 ? selectList?.map((name:any,index:number) => (
                                    <MenuItem key={index} value={name[showableData]} style={{background:'none'}}>
                                        <Checkbox size='small' checked={selectedOption?.indexOf(name[showableData]) > -1} />
                                        <ListItemText primary={name[showableLabel]} />
                                    </MenuItem>
                                )) : <MenuItem disabled style={{background:'none'}}>No Items Available</MenuItem>}
                            </Select>
                        </FormControl>
                    )
                }} />
        </div>

    )
}
export default MultiCheckboxSelectComponent;
