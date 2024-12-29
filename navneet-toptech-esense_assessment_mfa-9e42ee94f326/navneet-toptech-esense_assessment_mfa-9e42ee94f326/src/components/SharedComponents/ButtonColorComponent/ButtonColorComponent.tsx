import { Box, Button } from '@mui/material'
import React, { FC } from 'react';
import "./ButtonColorComponent.css";

type Props = {
    buttonVariant: any,
    textColor: string,
    label: string,
    backgroundColor: string,
    disabled?: boolean,
    width:string,
    height:string,
    borderColor?:string,
    onClick?:(e:any)=>void
}

const ButtonColorComponent: FC<Props> = ({ buttonVariant, textColor, label, backgroundColor, onClick,disabled ,width,height,borderColor}) => {
    return (
        <Box>
            <Button 
                style={{ border: backgroundColor, color: textColor }}
                className={`btnColorStyling ${label === "Not Attempted" ? "NotAttemptedClass" : label + "Class"}`}
                variant={buttonVariant}
                disabled={disabled}
                sx={{
                    textTransform: "none",
                    color: textColor,
                    border:`1px solid ${borderColor}`,
                    borderRadius: "4px",
                    height:height,
                    backgroundColor: backgroundColor,
                    width:width,
                    opacity: disabled ? 0.4 : 1
                    // ":hover":{
                    //     backgroundColor : backgroundColor,
                    //     borderColor:textColor
                    // }
                }}
                onClick={(event:any)=>{onClick && onClick(event)}}
            >{label}</Button>
        </Box>
    )
}

export default ButtonColorComponent