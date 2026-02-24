import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext';
import router from './router';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <AppStateProvider>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </AppStateProvider>
  // </React.StrictMode>
);
