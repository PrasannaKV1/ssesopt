import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "./MultiSelectComponent.css";
import Paper from '@mui/material/Paper';
import { Popper } from '@mui/material';
import { ReactComponent as Chevrondown } from "../../../assets/images/chevrondown.svg";
import { retainDataHandler } from '../../../constants/helper';

interface Props {
    options: any[],
    onChange: any,
    disable: boolean | undefined,
    multiType: string,
    addableFiled?: string,
    showableField: string,
    selectableField: string,
    values: string,
    lsName?: any,
    isFirstDisable?: boolean | undefined,
}
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MultiSelectComponentforFilters: React.FC<Props> = ({ lsName, options, onChange, disable, multiType, addableFiled, showableField, selectableField, values, isFirstDisable }) => {
    const listItemStyle: any = {};

    const PopperMy = function (props: any) {
        return (<Popper {...props} placement={isFirstDisable ? 'top-start' : 'bottom-start'} />)
    }
    if (isFirstDisable) {
        listItemStyle.width = "100px";
        listItemStyle.maxWidth = "150px";
    }

    const [disableOptionType, setDisableOptionType] = useState<any>([])
    const [disableAllOption, setDisableAllOption] = useState<boolean>(false)
    const [modOptions, setmodOptions] = useState<any[]>([...options])

    const convertStringToElement = (element: string, list: any[], selectableField: string) => {
        if (element?.length) {
            return element?.split(",").map((ele: string) => list?.find((element: any) => element[selectableField] === Number(ele)))
        } else {
            return []
        }
    }

    useEffect(() => {
        if (addableFiled && options && !options?.find((ele: any) => ele[showableField] === addableFiled)) {
            const modifiedOptions = [...options];
            if (modifiedOptions?.length > 0 && (isFirstDisable === undefined || isFirstDisable === false)) {
                modifiedOptions?.unshift({ [showableField]: addableFiled, [selectableField]: 0 });
            }
            setmodOptions(modifiedOptions);
        } else {
            setmodOptions([]);
        }
    }, [options]);

    useEffect(() => {
        if (values !== undefined) {
            if (values.split(",").includes("0")) {
                setDisableAllOption(true)
            }
            if (values == '') setDisableAllOption(false)
        }
    }, [values])

    useEffect(() => {
        if (lsName && options?.length > 0) {
            const populateData: any = retainDataHandler(options, selectableField, lsName, "qpList_history")
            if (populateData && populateData?.length > 0) {
                const getOptionLength = options?.map((x: any) => x[selectableField])
                if (Array.from(new Set(populateData))?.length === Array.from(new Set(getOptionLength))?.length) {
                    setDisableAllOption(true)
                }
                onChange(populateData)
            }
        }
    }, [options])

    return (
        <div className={`filterMultiSelect  ${disableAllOption ? 'selectall' : ''} ${disable ? "disableWrapper" : ""} `}>
            <Autocomplete PopperComponent={PopperMy}
                popupIcon={<Chevrondown />}
                className='multiSelectFilterAutoComp'
                onChange={(event, newValue) => {
                    const checkFilter = modOptions.filter((val: any) => val[selectableField]);
                    const datasFilter = checkFilter.map((ele: any) => ele[selectableField]);
                    const filterOptions: any = newValue.map((ele: any) => { if (ele !== undefined) return ele[selectableField] })
                    if (filterOptions.length > 0 && !filterOptions.includes(0) && checkFilter?.length === filterOptions?.length) {
                        setDisableAllOption(true)
                        onChange(datasFilter)
                    }
                    else if (filterOptions.length > 0 && !filterOptions.includes(0) && checkFilter?.length > filterOptions?.length) {
                        setDisableAllOption(false)
                        onChange(filterOptions)
                    }
                    else if (filterOptions.includes(0)) {
                        if (values.split(",").includes("0")) {
                            let combinearr = datasFilter.filter((val: any) => !filterOptions.includes(val));
                            onChange(combinearr)
                            setDisableAllOption(false)
                        }
                        else {
                            if (values.split(",")?.length === 1 && values.split(",").includes('')) {
                                setDisableAllOption(true)
                                onChange(datasFilter)
                            }
                            else if (!values.split(",").includes('0') && filterOptions.includes(0) && values.split(",")?.length != datasFilter?.length) {
                                setDisableAllOption(true)
                                onChange(datasFilter)
                            }
                            else {
                                setDisableAllOption(false)
                                onChange([])
                            }
                        }
                    } else {
                        setDisableAllOption(false)
                        onChange([])
                    }
                }}
                value={convertStringToElement(values, modOptions, selectableField)}
                multiple
                limitTags={1}
                id="checkboxes-tags-demo"
                options={modOptions}
                disableCloseOnSelect
                //Removed Disable functionality

                // getOptionDisabled={(option) =>
                //     option === (disableAllOption ? option[selectableField]===0 ? "": option : disableOptionType)
                // }
                getOptionLabel={(option: any) => disableAllOption ? (addableFiled || '') : (option?.[showableField].slice(0, 9) + `...`)}
                renderOption={(props, option, { selected }) => (
                    <li {...props} key={option.id} style={{ background: "none",...listItemStyle }} >
                        {!isFirstDisable && <Checkbox
                            icon={icon} 
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected ? selected : disableAllOption ? true : false}
                            value={option?.[selectableField]}
                        />}
                        {option?.[showableField]}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField {...params} label={`${addableFiled?.replace("All", "Select")}`} />
                )}
            />
        </div>
    );
};

export default MultiSelectComponentforFilters;