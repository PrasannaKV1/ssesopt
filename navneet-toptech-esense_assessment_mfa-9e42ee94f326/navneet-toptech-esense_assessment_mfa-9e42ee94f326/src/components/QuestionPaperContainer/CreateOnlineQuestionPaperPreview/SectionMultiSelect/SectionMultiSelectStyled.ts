import { Select,Stack, styled } from '@mui/material';

export const SectionMultiSelectStyledWrapper = styled(Stack)({
  width: '100%',
  '& .MuiFormLabel-filled, & > .Mui-focused': {
    opacity: 0,
  }
});

export const SectionMultiSelectStyled = styled(Select)({
  width: '100%',
  borderRadius: '8px',
  background: '#fff',
  borderColor: '#DEDEDE',
  '& .top-school-core_c_checkbox': {
    width: '100%',
  }
});
