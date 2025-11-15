import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/common/reset.css';
import './assets/css/common/index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
