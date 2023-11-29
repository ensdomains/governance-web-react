import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";

import { Button } from "@ensdomains/thorin";
import Gap from "../components/Gap";

import { useHistory } from "react-router-dom";
import { ReactComponent as SeamlessLogo } from "../assets/imgs/SeamlessLogo.svg";
import { largerThan } from "../utils/styledComponents";
import { theme } from "../components/theme";
import { parseAndUseDelegates } from "../utils/utils";
import { parse } from "graphql";

const END_FREE_DELEGATION_DATE = new Date(2022, 11, 8);

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
      <ButtonContainer>
        <DelegateButton text={"Get started"} onClick={handleClick} />
        {new Date() <= END_FREE_DELEGATION_DATE && (
          <ButtonCaption>
            Delegate for free until{" "}
            {END_FREE_DELEGATION_DATE.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
            })}
          </ButtonCaption>
        )}
      </ButtonContainer>
    </HomeContainer>
  );
};

export default Home;
