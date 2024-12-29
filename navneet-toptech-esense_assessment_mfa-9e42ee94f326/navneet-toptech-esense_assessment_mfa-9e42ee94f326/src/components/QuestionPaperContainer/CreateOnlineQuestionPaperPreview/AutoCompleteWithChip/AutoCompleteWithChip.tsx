import React, { useCallback, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Chip, TextField } from '@mui/material';
import { AutocompleteStyled } from '../AutocompleteStyled';
import { ReactComponent as SearchIcon } from '../../../../assets/images/SearchIcon.svg';
import { ReactComponent as CloseIcon } from '../../../../assets/images/closeIcon.svg';
import { AutoCompleteWithChipStyledWrapper } from './AutoCompleteWithChipStyled';
import { PaperInputStyled } from '../CreateOnlineQuestionPaperPreviewStyle';

type AutoCompleteWithChipProps = {
  controlName: string;
  options: any;
  label: string;
};

const AutoCompleteWithChip: React.FC<AutoCompleteWithChipProps> = (AutoCompleteWithChipProps) => {
  const [selectedStudentList, setSelectedStudentList] = useState([]);
  const { controlName, label, options:optionsprops } = AutoCompleteWithChipProps;
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const options = useMemo(
    () => optionsprops,
    [optionsprops]
  );

  const handleDelete = useCallback((id: any) => {
    setSelectedStudentList((value) => value.filter((v:any) => v.UserID !== id));
  }, []);

  return (
    <AutoCompleteWithChipStyledWrapper>
      <label className='labelStyled'>{label}</label>
      <Controller
        name={controlName}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <>
            <AutocompleteStyled
              {...field}
              multiple
              id='autoCompleteStudentListPopover'
              options={options}
              // @ts-ignore: Unreachable code error
              groupBy={(option) => `Section: ` + option.className}
              // @ts-ignore: Unreachable code error
              getOptionLabel={(option) => option.firstName}
              disableCloseOnSelect
              // @ts-ignore: Unreachable code error
              onChange={(_e, newValue) => { setSelectedStudentList(newValue); field.onChange(newValue)}}
              defaultValue={selectedStudentList}
              renderTags={() => null}
              value={selectedStudentList}
              popupIcon={null}
              size='small'
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder='Search Students by name or roll number....'
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <SearchIcon />,
                  }}
                  error={Boolean(errors[`${controlName}`])}
                  helperText={errors[`${controlName}`]?.message as string}
                  sx={{ ...PaperInputStyled, width: '400px' }}
                />
              )}
            />
            <div className='autoCompleteChipWapper'>
              {selectedStudentList?.map((student:any) => (
                <Chip
                  key={student?.UserID}
                  label={student.firstName}
                  variant='outlined'
                  onDelete={() => handleDelete(student.UserID)}
                  deleteIcon={<CloseIcon />}
                />
              ))}
            </div>
          </>
        )}
      />
    </AutoCompleteWithChipStyledWrapper>
  );
};

export default AutoCompleteWithChip;
