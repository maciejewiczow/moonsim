import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

const Container = styled.div`
    grid-area: status;

    display: flex;
    align-items: center;
    justify-content: center;
`

interface MoonStatusInjectedProps {
    isMoonVisible: boolean
}

const MoonStatusComponent = (props: /* MoonStatusInjectedProps */ any) => (
    <Container>
        <h1>Tu bedzie ikonka</h1>
    </Container>
)

// TODO: connect to store
export const MoonStatus = MoonStatusComponent
