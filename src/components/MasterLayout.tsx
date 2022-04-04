import styled from 'styled-components';

export const MasterLayout = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;

    display: grid;

    grid-template-columns: 200px 1fr 250px;
    grid-template-rows: 1fr 90px 70px;
    grid-gap: 4px;

    grid-template-areas:
        '. . .'
        'status . settings'
        'status phase-slider settings';
`;
