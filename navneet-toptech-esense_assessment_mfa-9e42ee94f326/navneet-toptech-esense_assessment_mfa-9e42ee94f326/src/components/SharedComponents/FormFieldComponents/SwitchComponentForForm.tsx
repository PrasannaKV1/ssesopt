import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { Box, Typography } from '@mui/material';
import "../SwitchComponent/SwitchComponent.css"
import { useFormContext, Controller } from "react-hook-form"
interface props {
    onChangeSwitch: any;
    checked?: boolean;
    disabled: boolean;
    beforeLabel: string;
    afterLabel: string,
    registerName: string,
    mandatory?: boolean
}
const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 44,
    height: 22,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 18,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(22px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(22px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#01B58A',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 18,
        height: 18,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

const SwitchComponentForForm: React.FC<props> = ({ onChangeSwitch, checked, disabled, beforeLabel, afterLabel, registerName, mandatory }) => {
    const { control,watch} = useFormContext();
    const [validation, setValidation] = useState(mandatory ? { required: "This Field is Required" } : {})
    const isChecked = () => {
        if (registerName?.includes('isFixed')) {
            return watch(registerName) ? false : checked ? false : true  as boolean
        } else {
            return watch(registerName) ?? checked as boolean
        }
    }
    return (
        <Box>
            <Box className="parentSwitch">
                <Box className="secondchildSwitch firstChildBoxSwitch me-1">
                    <span className="fullwidthInBothBoxSwitch ">
                        {beforeLabel}
                    </span>
                </Box>
                <Box className="firstchildSwitch firstChildBoxSwitch">
                    <Controller
                        rules={validation}
                        control={control}
                        name={registerName}
                        render={({ field: { onChange, value, ref }}) => {
                            const handleSwitchChange = (e: any) => {
                                if(registerName?.includes('isFixed')){
                                    onChange(e.target.checked ? false : true)
                                }else{
                                    onChange(e.target.checked)
                                }
                            }
                            return (
                                <AntSwitch
                                    ref={ref}
                                    checked={isChecked()}
                                    disabled={disabled}
                                    onChange={handleSwitchChange}
                                />
                            )
                        }} />
                </Box>&nbsp;
                <Box className="secondchildSwitch firstChildBoxSwitch ms-1">
                    <span className="fullwidthInBothBoxSwitch ">
                        {afterLabel}
                    </span>
                </Box>
            </Box>
        </Box>
    );
};
export default SwitchComponentForForm;