import React from 'react';
import styled from 'styled-components/macro'
import {gql} from "graphql-tag";
import {useQuery} from "@apollo/client";

import {CTAButton} from './buttons'
import {initWeb3} from "../web3modal";
import Profile from './Profile'

import HeaderENSLogo from '../assets/imgs/HeaderENSLogo.svg'

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
    const {data: {isConnected, address}} = useQuery(gql`
    query getHeaderData @client {
        address
        isConnected
    }
`)

    return (
        <HeaderContainer>
            <HeaderContainerInner>
                <LeftContainer>
                    <img src={HeaderENSLogo}/>
                </LeftContainer>
                <RightContainer>
                    {isConnected
                        ? <Profile {...{address}} />
                        : <CTAButton onClick={initWeb3} text={"Connect"}/>
                    }
                </RightContainer>
            </HeaderContainerInner>
        </HeaderContainer>
    );
};

export default Header;
