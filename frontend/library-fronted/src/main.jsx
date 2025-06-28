import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App/App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
