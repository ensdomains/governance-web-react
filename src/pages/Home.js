import React from "react";
import styled from "styled-components/macro";

import { Button } from "@ensdomains/thorin";
import Gap from "../components/Gap";

import { useHistory } from "react-router-dom";
import { ReactComponent as SeamlessLogo } from "../assets/imgs/SeamlessLogo.svg";
import { largerThan } from "../utils/styledComponents";
import { theme } from "../components/theme";
import { gql } from "graphql-tag";
import { initWeb3 } from "../web3modal";
import { useQuery } from "@apollo/client";

const USER_INFO_QUERY = gql`
  query delegateRankingQuery @client {
    isConnected
    address
  }
`;

export const config = {
  runtime: "edge",
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrappedTitle = styled.div`
  font-weight: bold;
  font-size: 36px;
  line-height: 118%;

  text-align: center;
  letter-spacing: -0.01em;
  color: black;
  background: ${theme.colors.gradients.seamless};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  ${largerThan.mobile`
    font-size: 44px;
  `}
`;

export const WrappedSubTitle = styled.div`
  ${(p) => p.fontSize && `font-size: ${p.fontSize}px;`}

  max-width: 440px;
  font-style: normal;
  font-weight: normal;
  line-height: 150%;

  text-align: center;
  letter-spacing: -0.01em;

  color: #717171;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ButtonCaption = styled.div`
  font-weight: bold;
  color: #717171;
`;

const DelegateButton = styled(Button)`
  width: 290px;
  background-color: ${theme.colors.gradients.seamless};
`;

const Home = () => {
  const { data: userData } = useQuery(USER_INFO_QUERY);

  const history = useHistory();

  const handleClick = () => {
    history.push("/dashboard");
  };

  return (
    <HomeContainer>
      <Gap height={4} />
      <SeamlessLogo />
      <Gap height={8} />
      <WrappedTitle>Help decide</WrappedTitle>
      <WrappedTitle>the future of Seamless</WrappedTitle>
      <Gap height={3} />
      <WrappedSubTitle fontSize={18}>
        Delegate your <b>$SEAM</b> to participate and govern the Seamless
        protocol.
      </WrappedSubTitle>
      <Gap height={4} />

      <Gap height={4} />
      {userData.address ? (
        <ButtonContainer>
          <DelegateButton text={"Get started"} onClick={handleClick} />
        </ButtonContainer>
      ) : (
        <Button
          data-testid="header-connect-button"
          onClick={initWeb3}
          text={"Connect"}
        />
      )}
    </HomeContainer>
  );
};

export default Home;
