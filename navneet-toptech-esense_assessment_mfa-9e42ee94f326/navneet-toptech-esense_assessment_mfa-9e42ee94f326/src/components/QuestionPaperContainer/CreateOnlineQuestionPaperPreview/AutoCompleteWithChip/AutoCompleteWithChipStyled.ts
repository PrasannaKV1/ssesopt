import { Stack, styled } from '@mui/material';

export const AutoCompleteWithChipStyledWrapper = styled(Stack)({
  width: '100%',
  '& .MuiFormLabel-filled, & > .Mui-focused': {
    // opacity: 0,
    '& .MuiOutlinedInput-notchedOutline': {
      borderWidth: 1,
    },
  },
  '& .autoCompleteChipWapper': {
    marginTop: 5,
    maxHeight: '90px',
    overflow: 'auto',
    '& .MuiChip-root': {
      borderRadius: '6px',
      border: '1px solid #01B58A',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 300,
      backgroundColor: '#FFFFFF',
      lineHeight: 'normal',
      margin: '0 4px 4px 0',
      '& svg': {
        width: '14px'
      }
    },
  },
});
