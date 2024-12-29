import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { CheckboxButtonControl } from '@esense/wrapper';
import { Controller, useFormContext } from 'react-hook-form';
import { SectionMultiSelectStyled, SectionMultiSelectStyledWrapper } from './SectionMultiSelectStyled';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { FormHelperText } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type props = {
  dropDownSelectValues: any[];
  loadStudentAttendanceByCourse: () => {};
};

const SectionMultiSelect: React.FC<props> = ({ dropDownSelectValues, loadStudentAttendanceByCourse }) => {
  const [selectedSection, setSelectedSection] = React.useState<string[]>([]);
  const [isSelectedAll, setIsSelectedAll] = React.useState(false);
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const handlAllCheck = (event: any, isAllChecked = false) => {
    const {
      target: { value },
    } = event;
    console.log('handlAllCheck', event, value);

    if (isAllChecked) {
      const getAllItems = dropDownSelectValues.map((value, index) => value.sectionid);
      setSelectedSection([...getAllItems]);
      setValue('assignSections', [...getAllItems], { shouldValidate: true });
      setIsSelectedAll(true);
    } else {
      setSelectedSection([]);
      setValue('assignSections', [], { shouldValidate: true });
      setIsSelectedAll(false);
    }
    loadStudentAttendanceByCourse();
  };

  const handleChange = (event: any, child: any) => {
    const {
      target: { value },
    } = event;
    if (value) {
      setSelectedSection(typeof value === 'string' ? value.split(',') : value);
      setValue('assignSections', value, { shouldValidate: true });
      if (value.length === dropDownSelectValues.length) {
        setIsSelectedAll(true);
      } else {
        setIsSelectedAll(false);
      }
    }
    loadStudentAttendanceByCourse();
  };

  return (
    <SectionMultiSelectStyledWrapper>
      <Controller
        name='assignSections'
        control={control}
        defaultValue={getValues('assignSections')}
        render={({ field }) => (
          <FormControl fullWidth size='small'>
            <InputLabel id='demo-simple-select-label'>Select section(s)...</InputLabel>
            <SectionMultiSelectStyled
              {...field}
              id='assignSections-multiple-checkbox'
              multiple
              value={selectedSection}
              onChange={(event, child) => {
                event && field.onChange(event);
                event && handleChange(event, child);
              }}
              renderValue={(selected: any) => selected?.map((el: any) => dropDownSelectValues.find((val) => val.sectionid === el).section).join(', ')}
              MenuProps={{ ...MenuProps, className: 'sectionSelectionPopover' }}
              size='small'
            >
              <MenuItem>
                <CheckboxButtonControl
                  label='Select all'
                  id='selectAllSections-checkbox'
                  checked={isSelectedAll}
                  onChange={(event, checked: boolean) => {
                    handlAllCheck(event, checked);
                  }}
                />
              </MenuItem>
              {dropDownSelectValues.map((value) => (
                <MenuItem key={value.sectionid} value={value.sectionid}>
                  <CheckboxButtonControl
                    label={value.section}
                    checked={selectedSection.indexOf(value.sectionid) > -1}
                  />
                </MenuItem>
              ))}
            </SectionMultiSelectStyled>
          </FormControl>
        )}
      />
      {errors.assignSections?.message && (
        <FormHelperText error>{errors.assignSections?.message as string}</FormHelperText>
      )}
    </SectionMultiSelectStyledWrapper>
  );
};

export default SectionMultiSelect;
