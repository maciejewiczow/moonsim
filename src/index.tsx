import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

// import mainReducer from 'reducers'
import App from './App';

window.onload = () => {
    const root = document.getElementById('app');

    if (root)
        createRoot(root).render(<App />);
};
