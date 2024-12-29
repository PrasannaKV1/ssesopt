import { createTheme } from '@mui/material';
import { Shadows } from '@mui/material/styles';
import { themeConfig as CommonTheme } from '@esense/wrapper';

import { colors } from './colors';
import type {} from '@mui/x-date-pickers/themeAugmentation';

export const themeConfig = createTheme(
  {
    palette: {
      background: {
        default: colors.theme.background,
      },
      primary: {
        main: colors.branding.primaryColor,
      },
    },
    typography: {
      fontFamily: 'Manrope',
    },
    shadows: Array(25).fill('none') as Shadows,
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            // ADD Form Control Style
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            // ADD Tabs Control Style
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            // ADD Tab Control Style
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            '& .MuiPickersDay-root:hover': {
              backgroundColor: colors.branding.primaryColor,
              color: colors.greys.white,
            },
            '& .MuiPickersDay-root.Mui-selected': {
              backgroundColor: colors.branding.primaryColor + '!important',
              color: colors.greys.white + '!important',
            },
            '& .MuiPickersDay-root.Mui-selected:hover': {
              backgroundColor: colors.branding.primaryColor,
              color: colors.greys.white,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Manrope',
            fontWeight: '700',
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '22px',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '8px 48px',
            '&.MuiButton-outlined': {
              color: colors.greys.black,
            },
            '&.MuiButton-contained': {
              color: colors.greys.white,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {},
            '& .MuiInputBase-input': {
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: '500',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            background: colors.greys.AquaHaze,
            borderRadius: '4px',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            '& .MuiDialog-paper': {
              width: '744px',
            },
            '.MuiDialogTitle-root': {},
            '.MuiDialogContent-root': {
              maxWidth: '100%',
            },
          },
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {},
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 32,
            height: 16,
            padding: 0,
            display: 'flex',
            margin: 'auto',
            '&:active': {
              '& .MuiSwitch-thumb': {
                width: 15,
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(12px)',
              },
            },
            '& .MuiSwitch-switchBase': {
              padding: 2,
              '&.Mui-checked': {
                transform: 'translateX(15px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                  opacity: 1,
                  backgroundColor: colors.branding.primaryColor,
                },
              },
            },
            '& .MuiSwitch-thumb': {
              boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
              width: 12,
              height: 12,
              borderRadius: 6,
              transition: 'width 2s linear 1s',
            },
            '& .MuiSwitch-track': {
              borderRadius: 16 / 2,
              opacity: 1,
              backgroundColor: 'rgba(0,0,0,.25)',
              boxSizing: 'border-box',
            },
          },
        },
      },
    },
  },
  CommonTheme,
);
