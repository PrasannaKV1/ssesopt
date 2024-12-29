import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "./SelectBoxComponent.css"

interface Props {
    variant: string;
    selectedValue: string;
    clickHandler: any;
    selectLabel: string;
    selectList: any[];
    mandatory: boolean;
    disabled?: boolean;
    module?:string;
};

const SelectBoxComponent: React.FC<Props> = ({ variant, selectedValue, clickHandler, selectLabel, selectList, mandatory, disabled,module }) => {
    const [age, setAge] = React.useState(selectedValue);

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
        clickHandler(event.target.value)
    };

    React.useEffect(() => {
      setAge(selectedValue)
    }, [selectedValue])

    return (
        <div className={variant == "fill" ? "selectFillType" : "selectTransparentType"}>
            <FormControl sx={{ m: 1 }}>
                <InputLabel>{selectLabel}{mandatory ? "*" : ""}</InputLabel>
                <Select
                    required={mandatory}
                    IconComponent={variant == "fill" ? ArrowDropDownIcon : KeyboardArrowDownIcon}
                    value={age}
                    label={selectLabel}
                    displayEmpty
                    disabled={disabled}
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChange}
                    MenuProps={{ className: "menuItem" }}
                >
                    {selectList?.length ? selectList?.map((ele:any, index: number) => {
                        return <MenuItem value={module==="questionTypes"?String(ele?.id) :module==="questionFont"?String(ele?.id):String(index)}>{module==="questionTypes"?ele?.type:module==="questionFont"?ele?.label:ele}</MenuItem>                        
                    }) :
                        <MenuItem disabled value={undefined} style={{background:'none'}} >No Items Available</MenuItem>
                    }
                    
                </Select>
            </FormControl>
        </div>
    );
};

export default SelectBoxComponent;