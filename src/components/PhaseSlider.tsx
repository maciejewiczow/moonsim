import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

const Container = styled.div`
    grid-area: phase-slider;
    display: flex;
    align-items: center;
    justify-content: center;
`

const PhaseSliderComponent = (props: any) => (
    <Container>
        <h2>Tu będzie slider</h2>
    </Container>
)

//TODO: connect this to store properly
export const PhaseSlider = PhaseSliderComponent
