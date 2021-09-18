import React from 'react';
import styled from 'styled-components/macro'

import { CTAButton } from './components/buttons'
import HeaderENSLogo from './assets/imgs/HeaderENSLogo.svg'

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 150px;
`

const HeaderContainerInner = styled.div`
    width: 100%;
    max-width: 1200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const LeftContainer = styled.div``

const RightContainer = styled.div``

const Header = () => {
    return (
        <HeaderContainer>
            <HeaderContainerInner>
                <LeftContainer>
                    <img src={HeaderENSLogo} />
                </LeftContainer>
                <RightContainer>
                    <CTAButton text={"Connect"} />
                </RightContainer>
            </HeaderContainerInner>
        </HeaderContainer>
    );
};

export default Header;
