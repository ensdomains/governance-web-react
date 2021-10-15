import React from 'react';
import styled from 'styled-components/macro'

import { Link, Title, SubTitle } from '../components/text'
import Gap from '../components/Gap'
import { CTAButton } from "../components/buttons";

import SplashENSLogo from '../assets/imgs/SplashENSLogo.svg'
import {useHistory} from "react-router-dom";
import {gql} from "graphql-tag";
import {useQuery} from "@apollo/client";
import {initWeb3} from "../web3modal";

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const WrappedTitle = styled(Title)`
`

const WrappedSubTitle = styled(SubTitle)`
    max-width: 560px;
`

const HOME_QUERY = gql`
  query privateRouteQuery @client {
    addressDetails
    isConnected
  }
`

const Home = () => {
    const {data: {isConnected}} = useQuery(HOME_QUERY)
    const history = useHistory();

    const handleClick = () => {
        if(isConnected) {
            history.push('/claim')
        } else {
            initWeb3()
        }
    }

    return (
        <HomeContainer>
            <img src={SplashENSLogo} />
            <Gap height={6}/>
            <Link>Introducing $ENS</Link>
            <Gap height={3}/>
            <WrappedTitle>Join the effort</WrappedTitle>
            <WrappedTitle>to decentralise ENS</WrappedTitle>
            <Gap height={3}/>
            <WrappedSubTitle>
                We are launching a governance token to begin handing over control over the protocol to the community.
            </WrappedSubTitle>
            <Gap height={8}/>
            <CTAButton text={isConnected ? "Get Started" : "Connect to wallet"} onClick={handleClick}/>
        </HomeContainer>
    );
};

export default Home;
