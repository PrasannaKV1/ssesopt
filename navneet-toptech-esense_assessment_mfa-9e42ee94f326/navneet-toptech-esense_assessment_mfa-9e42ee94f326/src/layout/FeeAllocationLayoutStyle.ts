import { styled } from '@mui/material/styles';
import { colors } from '../theme';
import { display } from '@mui/system';

export const FeeAllocationStyleRoot = styled('div')({
  '.rootDiv': {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.greys.BackgroundGrey,
    margin: '-8px',
    paddingBottom: '20px',
  },
  '.sideBarDiv': { width: '65px', zIndex: '100' },
  '.sideBarDiv .side-nav-lists .side-nav-list-one li:nth-child(3)': {
    display:"block"
  }, 
  '.contentDiv': { width: 'calc(100% - 65px)' },
  '.AddNewBtn': {
    '&.MuiButton-root': {
      padding: '0px',
      height: '40px',
      width: '123px',
    },
  },
  '.postSetupSearch': {
    width: '306px',
    borderRadius: '8px',
    padding: ' 8px 17px',
    height: '24px',
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'transparent',
    },
    '& .MuiButtonBase-root': {
      paddingLeft: '5px !important',
      paddingRight: '5px !important',
    },
  },
  '.postTableToppanel': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: '10vh',
    background: '#ffffff',
    padding: '20px 20px 5px 20px',
    borderRadius: '8px 8px 0px 0px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderBottom: 'none',
  },
  '.postSetupTable': {
    border: ' 1px solid #e6e8f0',
    '& .MuiTableCell-head .Mui-active': {
      color: colors.greys.SpanishGray,
      fontWeight: '600',
      fontSize: '12px',
    },
    '&.MuiTable-root ': {
      borderTop: 'none',
    },
    '& .MuiTableCell-root': {
      paddingLeft: '32px',
      boxShadow: 'inset 0px -1px 0px #e6e8f0',
      borderBottom: 'none',
      color: colors.greys.SpanishGray,
      fontWeight: '600',
      fontSize: '12px',
    },
    '@media screen and (max-width: 769px)': {
      '.assessment-questions .card-container': {
        width: 'calc(102% - 10px) !important',
      },
    },
  },
});
