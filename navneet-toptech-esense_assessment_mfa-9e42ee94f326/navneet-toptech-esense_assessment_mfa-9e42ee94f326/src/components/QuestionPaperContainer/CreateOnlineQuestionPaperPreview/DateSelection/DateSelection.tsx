import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, TextField } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { SectionMultiSelectStyledWrapper } from './DateSelectionStyled';
import { ReactComponent as IconCalender } from '../../../../assets/images/calender.svg';
import { ReactComponent as IconTime } from '../../../../assets/images/time.svg';
import { PaperInputStyled } from '../CreateOnlineQuestionPaperPreviewStyle';

interface DateSelectionProps {
  controlDate: string;
  controlDateLabel: string;
  controlTime: string;
  controlTimeLabel: string;
  className?: string;
}

const DateSelection: React.FC<DateSelectionProps> = (DateSelectionProps) => {
  const { controlDate, controlDateLabel, controlTime, controlTimeLabel, className } = DateSelectionProps;
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <SectionMultiSelectStyledWrapper className={className}>
      <FormControl className='dateFormControl'>
        <label className='labelStyled'>{controlDateLabel}</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={controlDate}
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <DatePicker
                {...field}
                inputFormat='DD/MM/YYYY'
                renderInput={(params:any) => (
                  <TextField
                    {...params}
                    size='small'
                    placeholder='DD/MM/YYYY'
                    error={Boolean(errors[`${controlDate}`])}
                    helperText={errors?.[`${controlDate}`]?.message as string}
                    sx={{ ...PaperInputStyled }}
                    // InputProps={{
                    //   ...params.InputProps,
                    //   endAdornment: <IconCalender  style={{width: 42}} />,
                    // }}
                  />
                )}
              />
            )}
          />
        </LocalizationProvider>
      </FormControl>
      <FormControl className='timeFormControl'>
        <label className='labelStyled'>{controlTimeLabel}</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={controlTime}
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <TimePicker
                {...field}
                renderInput={(params:any) => (
                  <TextField
                    {...params}
                    size='small'
                    placeholder='HH:MMPM'
                    error={Boolean(errors[`${controlTime}`])}
                    helperText={errors?.[`${controlTime}`]?.message as string}
                    sx={{ ...PaperInputStyled }}
                    // InputProps={{
                    //   ...params.InputProps,
                    //   endAdornment: <IconTime style={{width: 42}} />,
                    // }}
                  />
                )}
              />
            )}
          />
        </LocalizationProvider>
      </FormControl>
    </SectionMultiSelectStyledWrapper>
  );
};

export default DateSelection;
