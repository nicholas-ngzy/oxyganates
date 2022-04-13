import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import NavMenu from './components/NavMenu';
import Pages from './pages/Pages';

export default function App() {
  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <NavMenu />
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
