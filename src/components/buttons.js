import React from 'react';
import styled from 'styled-components/macro'

import theme from './theme'

const ButtonContainer = styled.div`
    background: ${theme.colors.blue};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);
    border-radius: 12px;
    color: white;
    padding: 14px 16px;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    letter-spacing: -0.01em;
    cursor: pointer;
`

export const CTAButton = (props) => {
    return (
        <ButtonContainer {...props}>
            {props.text}
        </ButtonContainer>
    );
};

