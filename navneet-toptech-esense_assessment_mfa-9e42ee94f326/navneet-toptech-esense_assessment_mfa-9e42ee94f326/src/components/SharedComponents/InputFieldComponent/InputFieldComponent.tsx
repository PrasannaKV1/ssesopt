import React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import "./InputFieldComponent.css"
import SearchIcon from '@mui/icons-material/Search';

interface Props{
    label:string;
    required:boolean;
    onChange:any;
    inputSize:string,
    variant:string,
    inputType: string,
    maxLength?:number,
    defaultval?:any,
    key?:any
};
const InputFieldComponent :React.FC<Props> =({key,defaultval,label,onChange,required,inputSize,variant, inputType,maxLength})=>{

    return (
        <div className={`inputFieldStylingSect ${variant == "searchIcon" ? "searchIconSect" : ""}`}>
            <TextField
                key={key&&key}
                className={`inputFieldStyling ${inputSize == "Medium" ? "mediumSize" : "largeSize"}`}
                required={required}
                defaultValue={defaultval?defaultval:""}
                label={label}
                onChange={onChange}
                type={inputType}
                onKeyPress={(event) => {
                     if (inputType === "tel") {
                        const allowedKeys = /[0-9]/;
                        if (!allowedKeys.test(event.key)) {
                            event.preventDefault();
                        }   
                    }
                }}
                inputProps={{
                    maxLength: maxLength,
                    
                  }}
            />
            
        </div>
    );


}


export default InputFieldComponent;
