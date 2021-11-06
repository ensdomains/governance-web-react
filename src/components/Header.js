import React from "react";
import styled from "styled-components/macro";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";

import { CTAButton } from "./buttons";
import { initWeb3 } from "../web3modal";
import Profile from "./Profile";

import { ReactComponent as HeaderENSLogo } from "../assets/imgs/HeaderENSLogo.svg";
import { Link } from "react-router-dom";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
`;

const HeaderContainerInner = styled.div`
  width: 100%;
  max-width: 1024px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftContainer = styled.div``;

const RightContainer = styled.div``;

const WrappedLogo = styled(HeaderENSLogo)`
  margin-bottom: -10px;
  margin-left: -20px;
`;

const Header = () => {
  const {
    data: { isConnected, address },
  } = useQuery(gql`
    query getHeaderData @client {
      address
      isConnected
    }
  `);

  return (
    <HeaderContainer>
      <HeaderContainerInner>
        <LeftContainer>
          <Link to={"/"}>
            <WrappedLogo />
          </Link>
        </LeftContainer>
        <RightContainer>
          {isConnected ? (
            <Profile data-testid="header-profile" {...{ address }} />
          ) : (
            <CTAButton data-testid="header-connect-button" onClick={initWeb3} text={"Connect"} />
          )}
        </RightContainer>
      </HeaderContainerInner>
    </HeaderContainer>
  );
};

export default Header;
