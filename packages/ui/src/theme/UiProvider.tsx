import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, type Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

export function UiProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}