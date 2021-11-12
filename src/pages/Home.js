import React from "react";
import styled from "styled-components/macro";

import { Link, Title, SubTitle } from "../components/text";
import Gap from "../components/Gap";
import { CTAButton } from "../components/buttons";

import { ReactComponent as SplashENSLogo } from "../assets/imgs/SplashENSLogo.svg";
import { useHistory } from "react-router-dom";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import { initWeb3 } from "../web3modal";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrappedTitle = styled.div`
  font-weight: bold;
  font-size: 44px;
  line-height: 118%;

  text-align: center;
  letter-spacing: -0.01em;
  background: linear-gradient(
    330.4deg,
    #44bcf0 4.54%,
    #7298f8 59.2%,
    #a099ff 148.85%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WrappedSubTitle = styled.div`
  max-width: 560px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 150%;

  text-align: center;
  letter-spacing: -0.01em;

  color: #717171;
`;

const HOME_QUERY = gql`
  query privateRouteQuery @client {
    address
    addressDetails
    isConnected
  }
`;

const Home = () => {
  const {
    data: { isConnected, address },
  } = useQuery(HOME_QUERY);
  const history = useHistory();

  const handleClick = () => {
    if (isConnected && address) {
      history.push("/dashboard");
    } else {
      initWeb3();
    }
  };

  return (
    <HomeContainer>
      <SplashENSLogo />
      <Link
        href="https://ens.mirror.xyz/-eaqMv7XPikvXhvjbjzzPNLS4wzcQ8vdOgi9eNXeUuY"
        target="_blank"
      >
        Introducing $ENS →
      </Link>
      <Gap height={3} />
      <WrappedTitle>Help decide</WrappedTitle>
      <WrappedTitle>the future of ENS</WrappedTitle>
      <Gap height={3} />
      <WrappedSubTitle>
        With the launch of <b>$ENS</b> and the <b>DAO</b>, the community will be
        empowered to govern the ENS protocol.
      </WrappedSubTitle>
      <Gap height={8} />
      <CTAButton
        text={isConnected && address ? "Get started" : "Connect wallet"}
        onClick={handleClick}
      />
    </HomeContainer>
  );
};

export default Home;
