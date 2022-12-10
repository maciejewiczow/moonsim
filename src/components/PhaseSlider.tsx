import { observer } from 'mobx-react-lite';
import React from 'react';
import { moon } from 'state/Moon';
import styled, { css } from 'styled-components';

const Container = styled.div`
    grid-area: phase-slider;
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    svg {
        position: absolute;
        top: -5px;
    }
`;

const Slider = styled.input`
    --thumb-height: 20px;

    width: 100%;
    appearance: none;
    background-color: transparent;
    position: relative;

    &::-webkit-slider-thumb {
        appearance: none;
        height: var(--thumb-height);
        width: 5px;
        margin-top: calc(var(--thumb-height)/(-2) + 1px);
        border-radius: 3px;
        background: white;
    }

    &::-webkit-slider-runnable-track {
        height: 2px;
        cursor: pointer;
        border-radius: 1.3px;
        background-color: rgba(255, 255, 255, 0.4);
    }

    &::after {
        content: '';
        position: absolute;
        top: -20px;
        bottom: -20px;
        right: 0;
        left: 0;
        cursor: pointer;
    }
`;

export const PhaseSlider: React.FC = observer(() => {
    const max = moon.maxDate.diff(moon.minDate, 'millisecond');
    const value = moon.date.diff(moon.minDate, 'millisecond');

    return (
        <Container>
            <Slider
                type="range"
                min={0}
                max={max}
                step={1}
                value={value}
                onChange={e => moon.setDate(moon.minDate.add(e.target.valueAsNumber, 'millisecond'))}
            />
        </Container>
    );
});
