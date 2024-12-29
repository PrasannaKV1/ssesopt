import { themeConfig } from '@esense/wrapper';
import { Box, styled } from '@mui/material';

export const CreateOnlineQuestionPaperRoot = styled(Box)({
  width: '100vw',
  margin: '0 auto',
  // paddingTop: 40,
  fontSize: '16px',
  position: 'fixed',
  top: 0,
  left: 0,
  overflow: 'auto',
  height: '100vh',
  background: '#F5F5F5',
  zIndex: '999',
  h1: {
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '29px',
    marginBottom: '16px',
  },
  h2: {
    fontSize: 16,
    fontWeight: 300,
  },
  '& .labelStyled': {
    marginTop: '16px',
    display: 'block',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: 'normal',
    marginBottom: '5px',
  },
  '& .MuiFormLabel-filled, & > .Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderWidth: 1,
    },
  },
  '& .contentBlock': {
    maxWidth: 890,
    margin: '0 auto',
    padding: '30px 0'
  },
});

export const CreateOnlineQuestionPaperBlock = styled(Box)({
  background: '#FFF',
  borderRadius: '14px',
  padding: '25px 20px 15px 15px',
  marginTop: 25,
  fontWeight: 300,
  '& .headerBlock': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  '& .checkBoxStylingwithlabel': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .autoSelectFooter': {
    padding: '12px 24px 0',
    boxShadow: '0px -7px 20px rgb(0 0 0 / 5%)',
    borderRadius: '0px 0px 8px 8px',
    margin: '0 -20px 0 -15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .MuiButtonBase-root + .MuiButtonBase-root': {
      marginLeft: '15px',
    },
  },
  '& .autoSelectFooter h4': {
    fontWeight: 500,
    gap: '10px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#1B1C1E',
  },
  '& .allowLastDate': {
    marginLeft: '-10px',
  },
});

export const AssessQuestionPaperBox = styled(Box)({
  background: '#ECF0FD',
  borderRadius: '8px 8px 0 0',
  padding: '25px 15px',
  marginTop: 25,
  display: 'flex',
  justifyContent: 'space-between',
  '& .boxLeft': {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 283px',
    '& .MarksTime': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 7,
      fontWeight: 500,
    },
  },
  '& .boxRight': {
    flex: '2',
    marginLeft: '25px',
    paddingTop: '25px',
    '& .top-school-core_c_checkbox': {
      marginTop: '10px',
    },
    '& .mb10': {
      marginBottom: '10px',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
  },
});

export const PaperInputStyled = {
  width: '100%',
  borderRadius: '8px',
  '& .MuiInputBase-root': {
    background: '#fff',
    borderColor: '#DEDEDE',
    borderRadius: '8px',
  },
};

export const OnlineQuestionPaperPreviewthemeConfig = {
  ...themeConfig,
};
