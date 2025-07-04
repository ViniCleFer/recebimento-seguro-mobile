import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    primary: {
      '700': '#084077',
    },
    secondary: {
      '700': '#ff5757',
    },
    gray: {
      '300': '#dcdcdc',
      '500': '#bdbdbd',
      '700': '#9e9e9e',
      '750': '#818181',
      '900': '#3e3e3e',
    },
    green: {
      '700': '#7ed957',
      '800': '#31cc03',
    },
    yellow: {
      '700': '#ffbd58',
    },
    red: {
      '700': '#ff0000',
    },
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
  },
  sizes: {
    14: 56,
  },
});
