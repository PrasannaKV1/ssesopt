import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import "./MultiSelectComponent.css";
import { retainDataHandler } from '../../../constants/helper';


interface Props {
    options: any[];
    onChange: (values: any[]) => void;
    disable: boolean | undefined;
    multiType: string;
    addableFiled?: string; // Used for "Select All" label
    showableField: string;
    selectableField: string;
    values: string;
    lsName?: any,

}

const MultiSelectWrapperNew: React.FC<Props> = ({ 
    options, 
    onChange, 
    disable, 
    multiType, 
    addableFiled, 
    showableField, 
    selectableField, 
    values,
    lsName 
}) => {
    const [modOptions, setModOptions] = useState<any[]>([]);
    useEffect(() => {
        setModOptions(options); // Update state based on new props
      }, [options]);

    const convertStringToElement = (element: string, list: any[], selectableField: string) => {
        if (element?.length) {
            return element.split(",").map((ele: string) => list.find((item: any) => item[selectableField] === Number(ele)));
        } else {
            return [];
        }
    };

    // Track the checked state of the main checkbox
    const allSelected = modOptions.length > 0 && modOptions.every(option => 
        convertStringToElement(values, modOptions, selectableField).some((item: any) => item[selectableField] === option[selectableField])
    );

    const handleChange = (option: any) => {
        const currentValue = convertStringToElement(values, modOptions, selectableField).map((item: any) => item?.[selectableField]);
        const newValue = currentValue.includes(option[selectableField]) 
            ? currentValue.filter((val: any) => val !== option[selectableField]) 
            : [...currentValue, option[selectableField]];

        onChange(newValue);
    };
    useEffect(() => {
        if (lsName && options?.length > 0) {
            const populateData: any = retainDataHandler(options, selectableField, lsName, "qpList_history")
            if (populateData && populateData?.length > 0) {
                const getOptionLength = options?.map((x: any) => x[selectableField])
                if (Array.from(new Set(populateData))?.length === Array.from(new Set(getOptionLength))?.length) {
                    // setDisableAllOption(true)
                }
                onChange(populateData)
            }
        }
    }, [options])

    // Handle "Select All" functionality
    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // If "Select All" is checked, select all options
            const allValues = modOptions.map((option) => option[selectableField]);
            onChange(allValues);
        } else {
            // If "Select All" is unchecked, clear all selections
            onChange([]);
        }
    };

    return (
        <div className={`filterMultiSelect ${disable ? "disableWrapper" : ""}`}>
            <Paper className="optionsPaper">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Checkbox
                        checked={allSelected}
                        onChange={handleSelectAllChange}
                    />
                    <span>{`${addableFiled}`}</span>
                </div>
                {modOptions.map((option) => (
                    <div key={option[selectableField]} style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                            checked={convertStringToElement(values, modOptions, selectableField).some((item: any) => item[selectableField] === option[selectableField])}
                            onChange={() => handleChange(option)}
                        />
                        <span>{option[showableField]}</span>
                    </div>
                ))}
            </Paper>
        </div>
    );
};

export default MultiSelectWrapperNew;
