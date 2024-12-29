import { Stack, styled } from '@mui/material';

export const SectionMultiSelectStyledWrapper = styled(Stack)({
  width: '100%',
  flexDirection: 'row',
  paddingRight: '20px',
  marginTop: '10px',
  '& .MuiFormLabel-filled, & > .Mui-focused': {
    // opacity: 0,
  },
  '& .top-school-core_c_input .MuiInputBase-root': {
    width: '100%',
    borderRadius: '8px',
    background: '#fff',
    borderColor: '#DEDEDE',
  },
  '& > .MuiFormControl-root': {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    // flex: 1,
    justifyContent: 'space-between',
    '&.dateFormControl': {
      width: '250px',
    },
    '&.timeFormControl': {
      width: '220px',
    },
    '& label': {
      marginRight: 10,
    },
    '& .MuiFormControl-root': {
      width: '165px',
      '& .MuiInputBase-input': {
        textTransform: 'uppercase',
      },
    },
  },
});
