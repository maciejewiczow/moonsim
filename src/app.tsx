import * as React from 'react'
import { createGlobalStyle } from 'styled-components'

import { MasterLayout, Background, MoonCanvas, MoonStatus, PhaseSlider, Settings } from 'components'

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
        background: black;
        font-family: 'Raleway', sans-serif;
        font-weight: 100;
    }
`

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <>
                <GlobalStyle />
                <Background>
                    <MoonCanvas />
                </Background>
                <MasterLayout>
                    <MoonStatus />
                    <PhaseSlider />
                    <Settings />
                </MasterLayout>
            </>
        )
    }
}
