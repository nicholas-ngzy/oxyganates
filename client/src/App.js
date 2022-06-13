import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Pages from './pages/Pages';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: ['Poppins', 'sans-serif'].join(','),
    },
  },
});
