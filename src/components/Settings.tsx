import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

const Container = styled.div`
    grid-area: settings;
`

const SettingsComponent = (props: any) => (
    <Container>
        <h2>Settings</h2>
        <ul>
            <li>Jeden setting</li>
            <li>Drugi setting</li>
        </ul>
    </Container>
)

// TODO: connect to store here
export const Settings = SettingsComponent
