import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Ensure rootElement is correctly typed
const rootElement = document.getElementById('root') as HTMLElement;

// Create the root and render the application
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
