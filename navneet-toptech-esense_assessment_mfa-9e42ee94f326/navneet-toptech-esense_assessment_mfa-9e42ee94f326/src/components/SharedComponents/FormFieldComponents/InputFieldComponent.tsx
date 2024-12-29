import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import "../InputFieldComponent/InputFieldComponent.css"
import { useFormContext, Controller } from "react-hook-form"
import { alphanumericNameRegex } from '../../../constants/helper';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
interface Props {
    label: string;
    required: boolean;
    onChange: any;
    inputSize: string,
    variant: string,
    inputType: string,
    registerName: string,
    maxLimit?:number,
    maxLength?:number,
    steps?:number,
    onChangehandle?:any,
    pattern?:RegExp,
    regex?:any,
    className?:string,
    disabled?:boolean,
    endIconOnClick?:any,
    iconFlag?:boolean,
    readOnly?:boolean,
};
const InputFieldComponentForForm: React.FC<Props> = ({ label, onChange,onChangehandle, required, inputSize, variant, inputType, registerName, maxLimit, maxLength,steps,pattern, regex, className, disabled, endIconOnClick,iconFlag, readOnly }) => {
    const { control, getValues, setError, formState:{errors}, clearErrors } = useFormContext();
    const [validation, setValidation] = useState<any>(required ? { required: "This Field is Required" } : {})
    // const [inputVal, setInputVal] = useState("")
    // const checkFirstString = (event:any) => {
    //     return event.target.value.length == 0
    // }
    useEffect(() => {
        if (pattern) {
          setValidation({
            ...validation,
            pattern: {
              value: new RegExp(pattern),
              message: 'Invalid input. Please follow the specified pattern.',
            },
          })
        }
      }, [])  

      const handleError = (data:any) => {
        if (data && registerName && errors && pattern && pattern?.test(data)) {
          clearErrors(registerName)
        } else {
          if (data) {
            if (pattern) {
              setError(registerName, {type: 'pattern', message: 'Please enter a valid input'})
            } else {
              clearErrors(registerName)
            }
          } else {
            if (required) {
              setError(registerName, {type: 'required', message: 'This field is required.'})
            } else {
              clearErrors(registerName)
            }
          }
        }
      }
    return (
        <div className={`inputFieldStylingSect ${variant == "searchIcon" ? "searchIconSect" : ""} ${className ? className : ''} ${disabled ? "disableTextField": ""}`}>

                <Controller
                name={registerName}
                rules={validation}
                control={control}
                render={({ field: { onChange, value, ref } }) => {
                    const handleContentChanges = (data: string) => {
                        if (inputType === "number") {
                            if (Number(data) > 0 && Number(data) <= Number(maxLimit)) {
                                if ((/^\d{0,4}\.\d{1,2}$|^\d{0,4}$/g.test(data))) {
                                    onChange(data)
                                    handleError(data)
                                }
                            } else if (data === "") {
                                onChange(data)
                                handleError(data)
                            }
                        } else if (registerName === "nameOfExamination") {
                            if(pattern&&pattern.test(data)){
                                onChange(data)
                                handleError(data)
                            }
                        } else if (registerName === "testName") {
                            if(pattern&&pattern.test(data)){
                                onChange(data)
                                handleError(data)
                            }
                        }else if(registerName==="examMarks"||registerName==="examTime"){
                            if(regex&&regex.test(data)){
                                onChange(data)
                                handleError(data)
                            }
                        }
                        else if(registerName==="examName"){
                            if(regex&&regex.test(data)){
                                onChange(data)
                                handleError(data)
                            }
                        } else {
                            onChange(data)
                            handleError(data)
                            if(registerName === "textReplace"){
                                onChangehandle(data)
                            }
                        }
                    }
                    return (
                        <TextField
                            className={`inputFieldStyling ${inputSize == "Medium" ? "mediumSize" : "largeSize"}`}
                            // {...register(registerName, validation)}
                            inputRef={ref}
                            // required={required}
                            autoComplete='off'
                            value={getValues(registerName) ? getValues(registerName) : ""}
                            label={`${label} ${required ? "*" : ""}`}
                            onChange={(e) => {
                                handleContentChanges(e.target.value);
                                // setInputVal(e.target.value)
                            }}
                             InputProps={{ inputProps: { type: inputType, min: 1, max: maxLimit,step:steps, maxLength: maxLength, readOnly: readOnly   },
                             endAdornment: iconFlag &&  ( // Add endAdornment prop for the end icon
                             <IconButton
                               edge="end"
                               onClick={endIconOnClick} // Handle the onClick event
                             >
                               <VisibilityIcon/>
                             </IconButton>
                           )
                         }}

                            type={inputType}
                            onKeyDown={ (evt:any) => {
                                if (label == 'Marks' || label == 'Time in minutes') {
                                    if ( ["e", "E", "+", "-"].includes(evt.key)) {
                                        evt.preventDefault()
                                    }
                                    if(label == 'Time in minutes' && (evt.key === '.' || evt.key === ',')){
                                        evt.preventDefault()
                                    }
                                    if(pattern == alphanumericNameRegex && (evt.key === '.' || evt.key === ',')){
                                        evt.preventDefault()
                                    }
                            }}}
                            onWheel={
                                (evt:any)=>{
                                    if(label == 'Marks' || label == 'Time in minutes'){
                                        evt.target.blur()
                                        evt.preventDefault()
                                    }
                                    if(label == 'Time in minutes' && (evt.key === '.' || evt.key === ',')){
                                        evt.target.blur()
                                        evt.preventDefault()
                                    }
                                    if(pattern == alphanumericNameRegex && (evt.key === '.' || evt.key === ',')){
                                        evt.preventDefault()
                                    }
                                }
                            }
                        onKeyUp={(event) => {
                            //console.log(event)
                            if(registerName==="examName"){
                                onChangehandle(event)
                            }                            
                        }}
                        disabled={disabled}
                        />
                    )
                }}
            />
        </div>
    );


}


export default InputFieldComponentForForm;
