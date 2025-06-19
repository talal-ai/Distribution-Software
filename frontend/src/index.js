import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './bootstrap.min.css';

// Use createRoot instead of ReactDOM.render for better performance (React 18)
const container = document.getElementById('root');
const root = createRoot(container);

// Disable StrictMode in production for better performance
root.render(
  process.env.NODE_ENV === 'production' ? (
    <Provider store={store}>
      <App />
    </Provider>
  ) : (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
);

// Only measure vitals in development to save resources in production
if (process.env.NODE_ENV !== 'production') {
  reportWebVitals(console.log);
} else {
  reportWebVitals();
} 