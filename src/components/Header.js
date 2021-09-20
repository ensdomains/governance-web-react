import React from 'react';
import styled from 'styled-components/macro'

import {CTAButton} from './buttons'
import HeaderENSLogo from '../assets/imgs/HeaderENSLogo.svg'
import {gql} from "graphql-tag";
import {useEffect} from "react";
import {useQuery} from "@apollo/client";
import {initWeb3} from "../web3modal";

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

const HEADER_QUERY = gql`
    query getHeaderData {
        
        isConnected @client 
    }
`

const useWeb3User = (isConnected, address) => {
    useEffect(() => {

    }, [isConnected, address])
}

const Header = () => {
    const { data: { isConnected, address } } = useQuery(HEADER_QUERY)
    useWeb3User(isConnected, address)

    return (
        <HeaderContainer>
            <HeaderContainerInner>
                <LeftContainer>
                    <img src={HeaderENSLogo} />
                </LeftContainer>
                <RightContainer>
                    {isConnected
                        ? (
                            <div>connected</div>
                        )
                        : (
                            <CTAButton onClick={initWeb3} text={"Connect"} />
                        )}
                </RightContainer>
            </HeaderContainerInner>
        </HeaderContainer>
    );
};

export default Header;
