import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './PrefixMultiSelectComponent.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { InputLabel, ListItemText } from '@mui/material';
import styled from '@emotion/styled';
interface Props {
  variant: string;
  id: string;
  minwidth: string;
  label: string;
  options: string[];
  selectedValues: string[];
  prefixLabel?:string;
  onChange: (values: string[]) => void;
}
const PreviewMultiSelectComponent: React.FC<Props> = ({
  id,
  label,
  variant,
  minwidth,
  options,
  selectedValues,
  onChange,
}) => {
  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    if (value.includes('All')) {
      if (selectedValues.length !== options.length) {
        onChange(options.filter((option) => option !== 'All'));
      } else {
        onChange([]);
      }
    } else {
      onChange(typeof value === 'string' ? value.split(',') : value);
    }
  };
  return (
    <div>
      <div className='selectInputStyling'>
        <FormControl variant='outlined' style={{ minWidth: minwidth }}>
          <InputLabel htmlFor={`${id}-label`}>{label}</InputLabel>
          <Select
            labelId={`${id}-label`}
            id={id}
            multiple
            IconComponent={variant === 'fill' ? ArrowDropDownIcon : KeyboardArrowDownIcon}
            value={selectedValues}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return label;
              }
              return `${label}: ${selected.join(', ')}`;
            }}
          >
            <MenuItem key='All' value='All'>
              <ListItemText primary='All' />
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};
export default PreviewMultiSelectComponent;