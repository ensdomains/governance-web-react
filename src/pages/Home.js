import React from "react";
import styled from "styled-components/macro";

import { Button } from "@ensdomains/thorin";
import Gap from "../components/Gap";

import { useHistory } from "react-router-dom";
import { ReactComponent as SplashENSLogo } from "../assets/imgs/SplashENSLogo.svg";
import { largerThan } from "../utils/styledComponents";

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
  background: linear-gradient(
    330.4deg,
    #44bcf0 4.54%,
    #7298f8 59.2%,
    #a099ff 148.85%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${largerThan.mobile`
    font-size: 44px;
  `}
`;

const WrappedSubTitle = styled.div`
  max-width: 440px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
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
  padding: 0 12px;
  font-weight: bold;
  color: #717171;
`;

const DelegateButton = styled(Button)`
  width: 100%;
`;

const Home = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push("/delegate-ranking");
  };

  return (
    <HomeContainer>
      <SplashENSLogo />
      <Gap height={1} />
      <WrappedTitle>Help decide</WrappedTitle>
      <WrappedTitle>the future of ENS</WrappedTitle>
      <Gap height={3} />
      <WrappedSubTitle>
        Delegate your <b>$ENS</b> to participate in the <b>ENS DAO</b>, and
        govern the ENS protocol.
      </WrappedSubTitle>
      <Gap height={10} />
      <ButtonContainer>
        <DelegateButton text={"Choose a Delegate"} onClick={handleClick} />
        <ButtonCaption>Delegate for free until December 8th</ButtonCaption>
      </ButtonContainer>
    </HomeContainer>
  );
};

export default Home;
