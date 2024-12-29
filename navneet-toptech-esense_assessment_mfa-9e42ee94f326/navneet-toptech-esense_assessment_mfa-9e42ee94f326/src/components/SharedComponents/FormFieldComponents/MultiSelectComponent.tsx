import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "../MultiSelectComponent/MultiSelectComponent.css";
import "./FormFieldComponents.css"
import { useFormContext, Controller } from "react-hook-form"
import { removeHtmlTag } from '../../../constants/helper';

interface Props {
    options: any[],
    onChange: any,
    disable: boolean,
    mandatory?: boolean,
    multiType: string,
    multiLabel: string,
    registerName: string,
    showableLabel?: string,
    showableData?: string,
    setErrorSupport:any,
    errorSupport:any
}
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const options = ['All types', 'MCQ', 'Subjective', 'Match the following', 'FIB', 'Short answer', 'Long answer']

const MultiSelectComponentForForm: React.FC<Props> = ({ options, registerName, onChange, disable, mandatory, multiType, multiLabel, showableLabel, showableData ,setErrorSupport,errorSupport}) => {
    const [validation, setValidation] = useState(mandatory ? { required: "This Field is Required" } : {})
    const {  getValues, control ,setError,clearErrors,setValue,formState:{errors}} = useFormContext()
    const [valued,setvalued]=useState<any>([])
    const [renderCount,setrenderCount]=useState<number>(0)
    const checkChecked = (value: number) => {
        return getValues(registerName)?.some((ele: any) => value == ele.errorTypeId)
    }

const filterData = (regValueDupli:any) => {
    if(regValueDupli?.length>0 &&options.length>0){
        let val = regValueDupli ?regValueDupli?.map((val: any) => {
            const tempData = options?.find((ele: any) => ele.id === val.errorTypeId);
            return tempData
        }) : []
        val=val?.filter((e:any)=>e!=undefined)
        setvalued(val)
        const regval= val?.map((ei:any)=>regValueDupli?.find((e:any)=>e.errorTypeId == ei.id))
        setValue(registerName,regval)
        if(!regval?.length){
            setError(registerName, {
                type: 'manual',
                message: 'Required'
              });
        }
    }
    else if(!getValues(registerName) && options.length==0){
        setvalued([])
        setValue(registerName,[])
    }
}

useEffect(()=>{
    if(getValues(registerName)?.length > 0){
        filterData(JSON.parse(JSON.stringify(getValues(registerName))))
    }
},[options])

useEffect(()=>{
    if(errorSupport){
        setvalued([]) 
        setErrorSupport(false)
    }
},[errorSupport])
    return (
        <div className={`${disable ? "disableWrapper" : ""} ${multiType == "Multi1" ? "multiSelectDropdown" : "multiSelectDefaultCheck selectFillType"}`}>
            <Controller
                rules={validation}
                control={control}
                name={registerName}
                render={({ field: { onChange, value,ref }, formState, fieldState }) => {
                    const handleChange = (data: any[]) => {
                        const dupliarr=data.map((ele:any)=>ele.id)
                         const dupliCount=dupliarr.reduce((acc,cur)=>{
                         if( acc[cur]){
                           acc[cur]=acc[cur]+1
                         }else{
                          acc[cur]=1
                         }
                         return acc
                      },{})
                          Object.entries(dupliCount).forEach(async ([key, value]) => {
                          if(value === 2){
                              delete dupliCount[key]
                          }
                          return dupliCount
                        })
                     
                        const uniquekey= Object?.keys(dupliCount)
                        const unique=uniquekey?.map((ele:any)=>({errorTypeId:ele}))
                            onChange(unique)
                       const uniquearr=uniquekey?.map((id:any)=>options?.find((ele:any)=>(ele.id == id)))
                          setvalued(uniquearr)
                          if (data.length === 0 && mandatory) {
                              setError(registerName,{type:"required",message:"This field is required"})
                          }else(
                              clearErrors(registerName)
                          )
                      }
                    return (
                        <Autocomplete
                            onChange={(event, newValue) => {
                                handleChange(newValue)
                            }}
                            multiple
                            limitTags={2}
                            id="checkboxes-tags-demo"
                            options={options? options : []}
                            value={valued}
                            defaultValue={valued}
                            disableCloseOnSelect
                            getOptionLabel={(option) => {
                                return showableLabel ? option?.[showableLabel]?.replace(removeHtmlTag, '') : option
                            }}
                            renderOption={(props, option, { selected }) => (

                                <li {...props} value={showableData ? option?.[showableData] : option}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        checked={checkChecked(showableData ? option?.[showableData] : option) ? true:false}
                                        style={{ marginRight: 8 }}
                                        value={showableData ? option?.[showableData] : option}
                                    />
                                    {showableLabel ? option?.[showableLabel]?.replace(removeHtmlTag, '') : option}
                                </li>
                            )}
                            renderInput={(params) =>(
                                    <TextField {...params} label={multiLabel}  inputRef={ref}/>
                                )
                            }
                        />
                    )
                }}
            />

        </div>
    );
};

export default MultiSelectComponentForForm;