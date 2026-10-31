import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster position="top-right" richColors closeButton />
    </ErrorBoundary>
  </StrictMode>
);
