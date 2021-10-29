import React from 'react';
import styled from 'styled-components/macro'

import {CTAButton} from './buttons'
import {largerThan} from "../utils/styledComponents";

const FooterContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  margin-top: ${p => p.grid ? '-20px' : '0px'};

  ${largerThan.tablet`
        grid-column-start: 1;
        grid-column-end: 3;    
    `}
`

const Footer = ({
                    rightButtonText,
                    rightButtonCallback,
                    leftButtonText,
                    leftButtonCallback,
                    disabled,
                    grid
                }) => {
    return (
        <FooterContainer {...{grid}}>
            {leftButtonText
                ? <CTAButton text={leftButtonText} onClick={leftButtonCallback} type="deny"/>
                : <div></div>
            }
            {rightButtonText
                ? <CTAButton
                    text={rightButtonText}
                    onClick={disabled ? () => null : rightButtonCallback}
                    type={disabled ? 'deny' : ''}
                />
                : <div></div>
            }
        </FooterContainer>
    );
};

export default Footer;
