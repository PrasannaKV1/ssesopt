import React, { useEffect, useState } from 'react';
import { Box } from "@mui/system";
import Checkbox from '@mui/material/Checkbox';
import './CheckBoxComponent.css'

type props = {
    checkLabel: string,
    disable: boolean,
    onChangeHandler: any,
    checkStatus: boolean
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CheckBoxComponent: React.FC<props> = ({ checkLabel, disable, onChangeHandler, checkStatus }) => {
    const [checkedStatus, setCheckedStatus] = useState<boolean>(false)

    const checkboxhandler = (e: any) => {
        setCheckedStatus(e.target.checked)
        onChangeHandler(e.target.checked);
    }
    useEffect(() => {
        setCheckedStatus(checkStatus)
    }, [checkStatus])

    return (
        <Box>
            <Checkbox {...label} checked={checkedStatus} disabled={disable} color="success" onChange={e => { checkboxhandler(e)}} onClick={(event) => {event.stopPropagation() }}  />
        </Box>
    );
};

export default CheckBoxComponent;