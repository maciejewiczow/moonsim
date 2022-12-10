import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

window.onload = () => {
    const root = document.getElementById('app');

    if (root)
        createRoot(root).render(<App />);
};
