import React, { useState,useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "./MultiSelectComponent.css";
import Paper from '@mui/material/Paper';
import { retainDataHandler } from '../../../constants/helper';

interface Props {
    options:string[],
    onChange:any,
    disable: boolean,
    multiType: string,
    lsName?:any,
    questionTypeData:any
}
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const options = ['All types','MCQ','Subjective','Match the following','FIB','Short answer','Long answer']

const MultiSelectComponent: React.FC<Props> = ({ questionTypeData,lsName,options, onChange,disable, multiType }) => {
    const [disableOptionType, setDisableOptionType] = useState<any>([])
    const [disableAllOption, setDisableAllOption] = useState<any>(Boolean)

    /*To get the Index Of selected Value(-1 is Used For Replace All Types Option)*/
    const gettingIndex = (array: string[]) => {
        if (array.length){
            return array.map((element: string) => options.indexOf(element) -1)
        }else{
            return []
        }
    }

    /*Selection Of All Values When All Types Option Clicked*/
    const selectAllIndex = () => {
        if (options.length) {
            const tempArray = options.map((element: string) => {
                if (element !== "All types") {
                    return options.indexOf(element) - 1
                }
            })
            return tempArray.filter((ele: any) => ele !== undefined)
        }
        else {
            return []
        }
    }
    function extractContent(s:any) {
        var span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
      };

      const [populateData,setpopulateData]=useState<any>([]);
      const [key,setKey]=useState(Math.random())
    useEffect(()=>{
        if(lsName && questionTypeData?.length>0){
            let data= retainDataHandler(questionTypeData,"id",lsName,"qbList_history","title")
            if(data && data?.length>0){
                if(Array.from(new Set([...data]))?.length=== (Array.from(new Set([...options]))?.length-1)){
                    setpopulateData(["All types"])
                    onChange(selectAllIndex())
                    setDisableOptionType([])
                    setDisableAllOption(true)
                }else{
                    setpopulateData(data??[])
                    let dataforPost= retainDataHandler(questionTypeData,"id",lsName,"qbList_history")
                    onChange(dataforPost??[])
                    setDisableOptionType(options[0]) 
                    setDisableAllOption(false)
                }
                setKey(Math.random())
            }
        }

    },[questionTypeData])
    
    return (
        <div className={`${disable ? "disableWrapper" : ""} ${multiType == "Multi1" ? "multiSelectDropdown" : "multiSelectDefaultCheck"}`}>
            <Autocomplete
                value={populateData}
                key={key}
                onChange={(event, newValue) => {
                    newValue.includes("All types") ? setDisableAllOption(true) : setDisableAllOption(false);
                    if(newValue.length > 0 && !newValue.includes("All types")){
                        onChange(gettingIndex(newValue))
                        setpopulateData(newValue??[])
                        setDisableOptionType(options[0]) 
                    }else if(newValue.includes("All types")){
                        onChange(selectAllIndex())
                        setpopulateData(["All types"])
                        setDisableOptionType([])
                    }else{
                        onChange(newValue)
                         setpopulateData(newValue??[])
                        setDisableOptionType([])
                        onChange([])
                    }
                }}
                multiple
                limitTags={1}
                id="checkboxes-tags-demo"
                options={options}
                disableCloseOnSelect
                getOptionDisabled={(option) =>
                    option === (disableAllOption ? option === "All types" ? "" : option : disableOptionType)
                }
                getOptionLabel={(option) => extractContent(option)}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected ? selected : disableAllOption ? true : false}
                    />
                    {extractContent(option)}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField {...params} label="Select Question Type" />
                )}
            />
        </div>
    );
};

export default MultiSelectComponent;