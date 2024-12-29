import { styled } from '@mui/material/styles';
import { Accordion, Button, MenuItem, Typography } from '@mui/material';

export const ReminderButton = styled(Button)({
  width: '90%',
  fontWeight: '700',
  fontSize: '14px !important',
  padding: '9px 32px !important',
  borderRadius: '8px !important',
});

export const MenuWithDiver = styled(MenuItem)({
  borderBottom: '1px solid' + "grey",
});

export const MenuTypographyDivider = styled(Typography)({
  borderBottom: '1px solid' + "grey",
});

export const MenuItemWithDiver = styled('div')({
  borderBottom: '1px solid' + "grey",
  marginLeft: '16px',
  marginRight: '16px',
});

export const ButtonFilter = styled(Button)({
  backgroundColor: 'white',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '22px',
  padding: '9px 5px 9px 16px !important',
  border: '1px solid' + "grey",
  whiteSpace: 'nowrap',
  justifyContent: 'space-between',
  '.filterPreText': {
    color: "grey",
    paddingRight: '2px',
  },
  '.filterSelectedText': {
    color:"grey",
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  '&.MuiButton-root:hover': {
    backgroundColor: "white" + '!important',
  },
});

export const AccordionFilter = styled(Accordion)({
  '&.MuiPaper-root': {
    boxShadow: 'none',
  },
  '& .MuiTypography-root': {
    fontWeight: '400',
    fontSize: '14px',
  },
  '& .MuiAccordionDetails-root': {
    padding: '0',
  },
  '& .MuiMenuItem-root': {
    paddingLeft: '0 !important',
  },
  '&.MuiPaper-root.Mui-expanded': {
    margin: '0 !important',
  },
});
