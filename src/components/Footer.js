import React from 'react';
import styled from 'styled-components/macro'

import Button from './Button'

const FooterContainer = styled.div`
    width: 100%;
    background: lightgrey;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Footer = ({ rightButtonText, rightButtonCallback, leftButtonText, leftButtonCallback}) => {
    return (
        <FooterContainer>
            {leftButtonText
                ? <Button text={leftButtonText} onClick={leftButtonCallback} />
                : <div></div>
            }
            {rightButtonText
                ? <Button text={rightButtonText} onClick={rightButtonCallback} />
                : <div></div>
            }
        </FooterContainer>
    );
};

export default Footer;
