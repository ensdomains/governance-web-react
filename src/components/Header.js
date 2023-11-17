import React from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components/macro";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";

import { initWeb3 } from "../web3modal";
import Profile from "./Profile";
import { largerThan } from "../utils/styledComponents";

import { ReactComponent as SeamlessLogo } from "../assets/imgs/Wordmark-seamless.svg";
import { ReactComponent as DefaultYellowWarning } from "../assets/imgs/YellowWarning.svg";
import { Link } from "react-router-dom";

import { theme } from "./theme";

import { Button } from "@ensdomains/thorin";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  flex-direction: column;
  background-color: ${theme.colors.bg.headerFooter};
`;

const HeaderContainerInner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 50%;

  justify-content: space-around;

  ${largerThan.tablet`
    flex-direction: row;
  `}
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const WrappedLogo = styled(SeamlessLogo)`
  margin-bottom: -10px;
  margin-left: -20px;
`;

const NetworkWarningContainer = styled("div")`
  padding: 2px 15px;
  border: 1px solid rgb(239, 239, 239);
  border-radius: 30px;
  color: rgb(136, 136, 136);
  display: flex;
  height: 50px;
  align-items: center;
  margin-bottom: 20px;
`;

const YellowWarning = styled(DefaultYellowWarning)`
  width: 20px;
  flex-shrink: 0;
  margin-right: 15px;
`;

const NetworkWarning = function () {
  return (
    <NetworkWarningContainer>
      <YellowWarning />
      Please change your network to Ethereum Mainnet
    </NetworkWarningContainer>
  );
};

const DelegateLink = styled(Link)`
  /* About */

  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */
  letter-spacing: -0.01em;
  margin-right: 15px;
  color: white;

  transition: color 0.3s ease, background 0.3s ease;

  &:hover {
    color: black;
    background: ${theme.colors.gradients.seamless};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ${(p) =>
    p.current &&
    `
      color: black;
      background: ${theme.colors.gradients.seamless};
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
  `}
`;

const StyledLink = styled.a`
  margin-top: 8px;
  margin-left: 8px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */
  letter-spacing: -0.01em;
  margin-right: 15px;
  color: white;

  transition: color 0.3s ease, background 0.3s ease;

  &:hover {
    color: black;
    background: ${theme.colors.gradients.seamless};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ${(p) =>
    p.current &&
    `
    color: black;
    background: ${theme.colors.gradients.seamless};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
`;

const Header = () => {
  const {
    data: { isConnected, address, network },
  } = useQuery(gql`
    query getHeaderData @client {
      address
      isConnected
      network
    }
  `);

  const navigation = [
    {
      link: "https://app.seamlessprotocol.com",
      title: "Dashboard",
    },
    {
      link: "https://app.seamlessprotocol.com",
      title: "Markets",
    },
    {
      link: "https://farms.seamlessprotocol.com",
      title: "Staking Farms",
    },
    {
      link: "/",
      title: "Claim",
    },
  ];

  let match = useRouteMatch("/delegate-ranking");
  return (
    <HeaderContainer>
      <HeaderContainerInner>
        <LeftContainer>
          <Link to={"/"}>
            <WrappedLogo />
          </Link>
          {navigation.map((item, index) => (
            <StyledLink
              key={index}
              href={item.link}
              current={item.title === "Claim"}
            >
              {item.title}
            </StyledLink>
          ))}
        </LeftContainer>
        <RightContainer>
          <DelegateLink to="delegate-ranking" current={match}>
            Delegates
          </DelegateLink>
          {isConnected && address ? (
            <Profile {...{ address }} size="medium" hasDropdown={true} />
          ) : (
            <Button
              data-testid="header-connect-button"
              onClick={initWeb3}
              text={"Connect"}
            />
          )}
        </RightContainer>
      </HeaderContainerInner>
      {network !== null && network !== 1 && <NetworkWarning />}
    </HeaderContainer>
  );
};

export default Header;
