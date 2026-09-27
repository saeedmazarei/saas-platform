import { createTheme, type Theme } from '@mui/material/styles';

export type AppThemeOptions = {
  primaryColor?: string;
};

export function createAppTheme({ primaryColor = '#3b5bdb' }: AppThemeOptions = {}): Theme {
  return createTheme({
    palette: {
      primary: { main: primaryColor },
      background: { default: '#f6f7f9' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { textTransform: 'none' } } },
      MuiPaper: { defaultProps: { variant: 'outlined' } },
      MuiTextField: { defaultProps: { fullWidth: true } },
    },
  });
}