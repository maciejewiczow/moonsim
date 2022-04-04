import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    grid-area: status;

    display: flex;
    align-items: center;
    justify-content: center;
`;

export const MoonStatus: React.FC = () => (
    <Container />
);
