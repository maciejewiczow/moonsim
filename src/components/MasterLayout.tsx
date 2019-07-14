import styled from 'styled-components'

export const MasterLayout = styled.div`
    width: 100%;
    height: 100%;

    display: grid;

    grid-template-columns: 200px 1fr 250px;
    grid-template-rows: 1fr 90px 110px;
    grid-gap: 4px;

    grid-template-areas:
        '. . .'
        'status . settings'
        'status phase-slider settings';

    & > div {
        background: #222;
        padding: 10px;
    }
`
