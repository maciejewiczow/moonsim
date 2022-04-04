import { observer } from 'mobx-react-lite';
import React from 'react';
import { moon } from 'state/Moon';
import {
    WiMoonNew,
    WiMoonWaxingCrescent1,
    WiMoonFirstQuarter,
    WiMoonWaxingGibbous4,
    WiMoonFull,
    WiMoonWaningGibbous4,
    WiMoonThirdQuarter,
    WiMoonWaningCrescent3,
} from 'react-icons/wi';
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

const IconWrapper = styled.div<{ isActive?: boolean }>`
    svg {
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);

        will-change: transfrom opacity;
        transition: all 0.15s ease-in-out;
        ${
    ({ isActive }) => (isActive
        ? css`
                transform: translate(-50%, -50%) scale(2);
                opacity: 1;
            `
        : css`
                opacity: 0.5;
            `)
}
    }
`;

const NewMoonFirst = styled(WiMoonNew)`
    left: 0;
`;

const WaxingCrescent = styled(WiMoonWaxingCrescent1)`
    left: 12.5%;
`;

const FirstQuater = styled(WiMoonFirstQuarter)`
    left: 25%;
`;

const WaxingGibbous = styled(WiMoonWaxingGibbous4)`
    left: 37.5%;
`;

const FullMoon = styled(WiMoonFull)`
    left: 50%;
`;

const WaningGibbious = styled(WiMoonWaningGibbous4)`
    left: 62.5%;
`;

const ThirdQuater = styled(WiMoonThirdQuarter)`
    left: 75%;
`;

const WaningCrescent = styled(WiMoonWaningCrescent3)`
    left: 87.5%;
`;

const NewMoonLast = styled(WiMoonNew)`
    right: 0;
`;

const maxAngle = Math.PI * 2;

export const PhaseSlider: React.FC = observer(() => {
    const percent = (maxAngle - moon.angle) / maxAngle;

    return (
        <Container>
            <IconWrapper isActive={percent >= 0 && percent <= 0.0625}><NewMoonFirst /></IconWrapper>
            <IconWrapper isActive={percent > 0.0625 && percent <= 0.1875}><WaxingCrescent /></IconWrapper>
            <IconWrapper isActive={percent > 0.1875 && percent <= 0.3125}><FirstQuater /></IconWrapper>
            <IconWrapper isActive={percent > 0.3125 && percent <= 0.4375}><WaxingGibbous /></IconWrapper>
            <IconWrapper isActive={percent > 0.4375 && percent <= 0.5625}><FullMoon /></IconWrapper>
            <IconWrapper isActive={percent > 0.5625 && percent <= 0.6875}><WaningGibbious /></IconWrapper>
            <IconWrapper isActive={percent > 0.6875 && percent <= 0.8125}><ThirdQuater /></IconWrapper>
            <IconWrapper isActive={percent > 0.8125 && percent <= 0.9375}><WaningCrescent /></IconWrapper>
            <IconWrapper isActive={percent > 0.9375 && percent <= 1}><NewMoonLast /></IconWrapper>
            <Slider
                type="range"
                min={0}
                max={maxAngle}
                step={0.01}
                value={maxAngle - moon.angle}
                onChange={e => moon.setAngle(maxAngle - e.target.valueAsNumber)}
            />
        </Container>
    );
});
