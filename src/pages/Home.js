import React from "react";
import styled from "styled-components/macro";

import { Button } from "@ensdomains/thorin";
import Gap from "../components/Gap";

import { useHistory } from "react-router-dom";
import { ReactComponent as SeamlessLogo } from "../assets/imgs/SeamlessLogo.svg";
import { largerThan } from "../utils/styledComponents";

const END_FREE_DELEGATION_DATE = new Date(2022, 11, 8);

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
  /* background: linear-gradient(
    330.4deg,
    #44bcf0 4.54%,
    #7298f8 59.2%,
    #a099ff 148.85%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */

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
  font-weight: bold;
  color: #717171;
`;

const DelegateButton = styled(Button)`
  width: 290px;
`;

const Home = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push("/delegate-ranking");
  };

  return (
    <HomeContainer>
      <SeamlessLogo />
      <Gap height={1} />
      <WrappedTitle>Help decide</WrappedTitle>
      <WrappedTitle>the future of Seamless</WrappedTitle>
      <Gap height={3} />
      <WrappedSubTitle>
        Delegate your <b>$SEAM</b> to participate and govern the Seamless
        protocol.
      </WrappedSubTitle>
      <Gap height={10} />
      <ButtonContainer>
        <DelegateButton text={"Choose a Delegate"} onClick={handleClick} />
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
