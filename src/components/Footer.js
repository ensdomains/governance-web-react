import React from 'react';
import styled from 'styled-components/macro'

import { CTAButton } from './buttons'

const FooterContainer = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
`

const Footer = ({ rightButtonText, rightButtonCallback, leftButtonText, leftButtonCallback}) => {
    return (
        <FooterContainer>
            {leftButtonText
                ? <CTAButton text={leftButtonText} onClick={leftButtonCallback} type="deny"  />
                : <div></div>
            }
            {rightButtonText
                ? <CTAButton text={rightButtonText} onClick={rightButtonCallback} />
                : <div></div>
            }
        </FooterContainer>
    );
};

export default Footer;
