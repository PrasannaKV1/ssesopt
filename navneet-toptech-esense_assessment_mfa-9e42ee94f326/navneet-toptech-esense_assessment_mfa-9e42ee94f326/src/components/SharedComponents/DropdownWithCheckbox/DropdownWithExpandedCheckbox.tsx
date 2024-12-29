import React, { useEffect, useState } from "react";
import {
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    ListItemIcon,
    FormControl,
    InputLabel
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Controller, useFormContext } from "react-hook-form";
import FilterIcon from '../../../assets/images/FilterIcon.svg';
import "./DropdownWithCheckbox.css"

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
    preSetVal?:any;
    trigger?:boolean;
	setCompval?:(e:any)=>void;
	setpostObj?:(e:any)=>void;
    flag?:boolean;
    reorderStatus?:any;
    setReorderStatus?:(e:any)=>void
};

const DropdownWithExpandCheckbox: React.FC<Props>  = ({setReorderStatus,reorderStatus, setpostObj,trigger,setCompval,variant,value, preSetVal,showableLabel,showableData,required, clickHandler, selectLabel, selectList, mandatory, disabled, registerName, menuHeader,flag }) => {
    const [selectedOptions, setSelectedOptions] = useState<any>([]);
    const [options, setOptions] = useState<any>([])
    const { register, reset, unregister, getValues, control } = useFormContext();
    const [validation, setValidation] = useState(required ? { required: "This Field is Required" } : {})
    const [reorderList, setReorderList] = useState(reorderStatus || false);
        React.useEffect(()=>{
            if(preSetVal?.[registerName]?.length >0 && selectList?.length >0){
                const presetChap=preSetVal?.[registerName].map((x:any)=>Number(x))
                const initSel: any =selectList?.flatMap((x:any)=>x.childOptions)?.filter((y:any)=>presetChap?.includes(y.value))?.map((z:any)=>z.value)
                setSelectedOptions(initSel)
                clickHandler(initSel)
                // setpostObj && setpostObj((pre: any) => ({ ...pre, [registerName]: initSel }))
                setCompval && setCompval((prev:any)=>({...prev,[registerName]: initSel}))
                }else{
                setSelectedOptions([])
                }     
            },[preSetVal?.[registerName],selectList,trigger])


    useEffect(()=>{
        if(flag){
            setOptions(selectList);
            return
        }
        if(registerName == "chapterId" && selectedOptions.length > 0 && (reorderStatus && !reorderStatus)){
            let selectedArray:any[] = [];
            let reorderingList:any = selectList;
            let selectListObj = JSON.parse(JSON.stringify(selectList));
            selectList.map((listOption,index:number) => {
                listOption?.childOptions.map((listOptionItem:any) => {
                    if(selectedOptions.includes(listOptionItem.value)) {
                        if(!selectedArray.includes(index))selectedArray.push(index)
                    }
                })
            })
            reorderingList = reorderingList.filter((id:any,index:number)=>{
                return !selectedArray.includes(index)
            })
            selectedArray.map((listOptionItem:any,index:number) => {
                let selectedArrayElm = selectListObj[listOptionItem]
                reorderingList.splice(index, 0, selectedArrayElm)
            })
            const checkedOptions = reorderingList?.map((parentOpt:any)=>{
                const reorderingChildList = [] as any;
                parentOpt?.childOptions?.forEach((childOpt:any)=>{
                    if(selectedOptions?.includes(childOpt?.value)) {
                        reorderingChildList.unshift(childOpt);
                    }else{
                        reorderingChildList.push(childOpt);
                    }
                })
                return {...parentOpt,childOptions:reorderingChildList}
            })
            setReorderStatus && setReorderStatus(true)
            setOptions(checkedOptions);
            setReorderList(checkedOptions)
        }else{
            setOptions(reorderList ? reorderList : selectList);
        }
        
    },[selectList, selectedOptions])

    useEffect(()=>{
        if(value?.length == 0){
            setSelectedOptions([])
            setReorderStatus&& setReorderStatus(false)
        }else{
            setSelectedOptions(value)
            setReorderStatus&& setReorderStatus(false)
        }
    },[value])

    const handleOptionSelect = (optionValue:any,src:string) => {
        let isSelected ;
        if(src=== "parent"){
            const childAvail:any=options?.filter((par:any)=>par?.value == optionValue &&  par)?.flatMap((p:any)=>p.childOptions)?.map((chd:any) =>chd?.value)
            if(selectedOptions.length >0){
                isSelected = childAvail.map((x:any)=>selectedOptions.includes(x)).every((y:any)=>y==true)
            }else{
                isSelected=false
            }
        }else{
            isSelected =selectedOptions.includes(optionValue);
        }

        let updatedOptions = [];

        if (isSelected) {
            updatedOptions = selectedOptions.filter((value:any) => value !== optionValue);
            const parentOption = options.find(
                (option:any) => option.value === optionValue
            );
            if (parentOption) {
                const childOptionValues = parentOption.childOptions.map(
                    (childOption:any) => childOption.value
                );
                updatedOptions = updatedOptions.filter(
                    (value:any) => !childOptionValues.includes(value)
                );
            }
        } else {
            if(src=== "parent"){
            updatedOptions = [...selectedOptions];
            }else{
            updatedOptions = [...selectedOptions, optionValue];
            }
            const selectedParentOption = options.find(
                (option:any) => option.value === optionValue
            );
            if (selectedParentOption) {
                const childOptionValues = selectedParentOption.childOptions.map(
                    (childOption:any) => childOption.value
                );
                updatedOptions = Array.from(
                    new Set([...updatedOptions, ...childOptionValues])
                );
            }
        }

        setSelectedOptions(updatedOptions);
        clickHandler(updatedOptions)
    };

    const handleSelectAll = () => {
        if (selectedOptions.length === getTotalChildOptionsCount(options)) {
            setSelectedOptions([]);
            clickHandler([])
        } else {
            const allChildOptions = getAllChildOptions(options);
            const allOptionValues = allChildOptions.map((option:any) => option.value);
            setSelectedOptions(allOptionValues);
            clickHandler(allOptionValues)
        }
    };

    const handleExpandCollapse = (parentOption:any) => {
        parentOption.isExpanded = !parentOption.isExpanded;
        setSelectedOptions([...selectedOptions]);
    };

    const isParentOptionChecked = (parentOption:any) =>
        parentOption.childOptions.every((childOption:any) =>
            selectedOptions.includes(childOption.value)
        ) && parentOption.childOptions.length > 0;

    const areAllChildOptionsChecked = (parentOption:any) =>
        parentOption.childOptions.every((childOption:any) =>
            selectedOptions.includes(childOption.value)
        );

    const renderOption = (option:any) => {
        const isChecked = selectedOptions?.includes(option?.value);
        return (
            <MenuItem key={option?.value} value={option?.value}  onClick={() => handleOptionSelect(option?.value,"child")}>
                <Checkbox
                    checked={isChecked}
                />
                <ListItemText primary={option?.label} />
            </MenuItem>
        );
    };

    const renderParentOption = (parentOption:any) => {
        const isChecked = isParentOptionChecked(parentOption);
        const isIndeterminate =
            parentOption?.childOptions?.some((childOption: any) =>
                selectedOptions?.includes(childOption.value)
            ) && !isChecked;
        const selectedChildOptions: any = parentOption?.childOptions?.filter(
            (childOption: any) => selectedOptions?.includes(childOption.value)
        );

        return (
            <div key={parentOption?.value} className="dropDownWithExpanField">
                <MenuItem>
                    <Checkbox
                        checked={isChecked}
                        indeterminate={isIndeterminate}
                        onClick={() => handleOptionSelect(parentOption.value,"parent")}
                    />
                    <ListItemText
                        primary={`${parentOption.label}${selectedChildOptions.length > 0
                            ? ` (${selectedChildOptions.length})`
                            : ""
                            }`}
                    />
                    <ListItemIcon onClick={() => handleExpandCollapse(parentOption)}>
                        {parentOption.isExpanded ? (
                            <ExpandMoreIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </ListItemIcon>
                </MenuItem>
                {parentOption.isExpanded &&
                    parentOption.childOptions.map((childOption:any) =>
                        renderOption(childOption)
                    )}
            </div>
        );
    };

    const renderSelectedText = () => {
        const selectedChildOptions = getAllChildOptions(options);
        const selectedCount = selectedChildOptions.filter((option:any) =>
            selectedOptions.includes(option.value)
        ).length;

        if (selectedCount === selectedChildOptions.length) {
            return "All";
        } else if (selectedCount === 0) {
            return "";
        } else {
            return `${selectedCount} selected`;
        }
    };

    const getTotalChildOptionsCount = (options:any) => {
        const childOptions = getAllChildOptions(options);
        return childOptions?.length;
    };

    const getAllChildOptions = (options:any) => {
        return options?.flatMap((option:any) => option?.childOptions || []);
    };

    const isSelectAllChecked =
        selectedOptions.length === getTotalChildOptionsCount(options);

    return (
        <div className={variant == "fill" ? "selectFillType selectMultiFillType" : "selectTransparentType"}>
            <Controller
                name={registerName}
                rules={validation}
                control={control}
                render={({ field: { onChange, value, ref } }) => {
                    return(
                        <FormControl fullWidth>
                            <InputLabel>{selectLabel}{mandatory ? "*" : ""}</InputLabel>
                    <Select
                        multiple
                        value={selectedOptions}
                        onChange={() => {  }}
                        renderValue={renderSelectedText}
                        fullWidth
                        MenuProps={{
                            elevation: 1
                        }}
                        disabled={disabled}
                    >
                        <MenuItem  className="dropDownWithExpanField" onClick={() =>{ setSelectedOptions([]);clickHandler([])}}>
                        <img src={FilterIcon} style={{paddingRight:"13px"}}/> Clear Selection
                        </MenuItem>
                        <MenuItem className="dropDownWithExpanField" onClick={handleSelectAll}>
                            <ListItemIcon>
                                <Checkbox checked={isSelectAllChecked} onClick={handleSelectAll} />
                            </ListItemIcon>
                            <ListItemText primary="Select All" />
                        </MenuItem>
                        {options?.map((option: any) =>
                            option?.childOptions ? renderParentOption(option) : renderOption(option)
                        )}
                    </Select>
                    </FormControl>
                    )
                }} />
        </div>
    );
};

export default DropdownWithExpandCheckbox;
