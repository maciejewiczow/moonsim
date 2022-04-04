import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import {
    MasterLayout,
    MoonCanvas,
    MoonStatus,
    PhaseSlider,
    Settings,
} from 'components';

const GlobalStyle = createGlobalStyle`
    *,
    *::after,
    *::before {
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    html, body, #app {
        height: 100%;
        width: 100%;
    }

    body {
        margin: 0;
        color: white;
        font-family: 'Roboto', sans-serif;
        font-weight: 100;
    }
`;

const App: React.FC = () => (
    <React.Fragment>
        <GlobalStyle />
        <React.Suspense fallback="Loading...">
            <MoonCanvas />
            <MasterLayout>
                <MoonStatus />
                <PhaseSlider />
                <Settings />
            </MasterLayout>
        </React.Suspense>
    </React.Fragment>
);

export default App;
