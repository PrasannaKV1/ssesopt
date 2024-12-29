import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "./SelectBoxComponent.css"
import ClearIcon from '../../../assets/images/FilterIcon.svg'

interface Props {
    variant: string;
    selectedValue: string;
    clickHandler: any;
    selectLabel: string;
    selectList: any[];
    mandatory: boolean;
    disabled?: boolean;
    module?:string;
    onFocus?:any
};

const SelectBoxForWorkBook: React.FC<Props> = ({ variant, selectedValue, clickHandler, selectLabel, selectList, mandatory, disabled,module, onFocus }) => {
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
                    onFocus={onFocus}
                    MenuProps={{ className: "menuItem" }}
                >
                    {selectList?.length ? selectList.map((ele: any, index: number) => {
                        const isDisabled = ele === 'Clear Selection' && (age == null || age === '' || age === '0');
                        return (
                            <MenuItem
                                key={index}
                                style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
                                value={module === "questionTypes" ? String(ele?.id) : module === "questionFont" ? String(ele?.id) : String(index)}
                            >
                                {ele === '3 Lines' && (
                                    <div className="line-3">
                                        <div className="red-line"></div>
                                        <div className="blue-line"></div>
                                        <div className="red-line"></div>
                                    </div>
                                )}

                                {ele === '4 Lines' && (
                                    <div className="line-4">
                                        <div className="red-line"></div>
                                        <div className="blue-line"></div>
                                        <div className="blue-line"></div>
                                        <div className="red-line"></div>
                                    </div>
                                )}
                                {ele === '5 Lines' && (
                                    <div className="line-5">
                                        <div className="red-line"></div>
                                        <div className="blue-line"></div>
                                        <div className="dotted-line"></div>
                                        <div className="blue-line"></div>
                                        <div className="red-line"></div>
                                    </div>
                                )}

                                {ele === 'Solid Line(s)' && (
                                    <div className="line-single"></div>
                                )}

                                {ele === '2 Lines' && (
                                    <div className="line-2">
                                        <div></div>
                                        <div></div>
                                    </div>
                                )}

                                {ele === 'Rectangle(s)' && <div className="rectangle" />}

                                {ele === 'Box(s)' && (
                                    <div className="box-group">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                )}
                                {ele === 'Blank' && (
                                    <div className="blank">
                                        <div>{'['}</div>
                                        <div>{']'}</div>
                                    </div>
                                )}
                                {ele === 'Clear Selection' && (
                                        <div>
                                            <img src={ClearIcon} alt="Clear Selection" />
                                        </div>
                                    )
                                }    
                                <span>{ele}</span>
                            </MenuItem>
                        );
                    }) :
                        <MenuItem disabled value={undefined} style={{background:'none'}} >No Items Available</MenuItem>
                    }
                    
                </Select>
            </FormControl>
        </div>
    );
};

export default SelectBoxForWorkBook;
