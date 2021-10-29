import React from 'react';
import styled from 'styled-components'

import GreenTick from '../assets/imgs/GreenTick.svg'
import RedTick from '../assets/imgs/RedTick.svg'

const PillContainerOuter = styled.div`
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const PillContainer = styled.div`
    background: ${p => p.error ? 'rgba(213, 85, 85, 0.1)' : 'rgba(73, 179, 147, 0.1)'};
    border-radius: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 16px 10px 10px;
`

const Logo = styled.img`
    margin-right: 6px;
`

const Text = styled.div`
    margin-bottom: 1px;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    display: flex;
    align-items: center;
    letter-spacing: -0.01em;
    color: ${p => p.error ? '#D55555' : '#49B393'};
`

const Pill = ({text, error}) => {
    return (
        <PillContainerOuter>
            <PillContainer error={error}>
                <Logo src={error ? RedTick : GreenTick} />
                <Text error={error}>{text}</Text>
            </PillContainer>
        </PillContainerOuter>
    );
};

export default Pill;
