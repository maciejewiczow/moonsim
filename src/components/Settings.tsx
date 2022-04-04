import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    grid-area: settings;
`;

const SettingsComponent: React.FC = () => (
    <Container />
);

// TODO: connect to store here
export const Settings = SettingsComponent;
