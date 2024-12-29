const greys = {
  black: '#000000',
  AltoGray: '#DEDEDE',
  SpanishGray: '#9A9A9A',
  white: '#FFFFFF',
  AquaHaze: '#F4F6F9',
  ShuttleGray: '#5F6061',
  C2C2C2: '#C2C2C2',
  BackgroundGrey: '#F5F5F5',
  GalleryGray: '#EFEFEF',
  ShadeGray: '#FCFCFD',
  GreyRed: '#FEDED9',
  TableStroke: '#E6E8F0',
};
const reds = {
  DestructiveRed: '#F95843',
};
const blue = {
  TrueV: '#6E55D5',
};

const branding = {
  primaryColor: '#01B58A',
  secondaryColor: '#1B1C1E',
  accentColor: '#385DDF',
  destructiveRedColor: '#F95843',
  validation: '#996A13',
};

const CircularProgressBar = {
  background: '#FEEEEC',
  activeColor: '#F95843',
};

const controls = {
  default: {
    up: {
      text: greys.black,
      background: greys.white,
      border: greys.AltoGray,
    },
    hover: {
      border: branding.primaryColor,
    },
    selected: {
      border: branding.primaryColor,
    },
  },
};

const checkbox = {
  normal: {
    backgroundColor: greys.white,
    border: greys.SpanishGray,
  },
  checked: {
    backgroundColor: branding.primaryColor,
    border: branding.primaryColor,
  },
};

const text = {
  default: {
    color: branding.secondaryColor,
  },
  light: {
    color: greys.SpanishGray,
  },
  highlight: {
    color: branding.primaryColor,
  },
  link: {
    color: branding.accentColor,
  },
};

const theme = {
  accent: branding.primaryColor,
  text: text.default.color,
  border: greys.AltoGray,
  success: '#24A148',
  successBG: '#e6f8ef',
  warning: '#F6BC0C',
  warningBG: '#FEF8E7',
  danger: '#D85564',
  dangerBG: 'rgba(216, 85, 100, 0.1)',
  background: greys.ShadeGray,
  publish: '#457B3B',
};

export const colors = {
  checkbox,
  greys,
  branding,
  controls,
  text,
  theme,
  reds,
  blue,
  CircularProgressBar,
};
