import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";

import { Button } from "@ensdomains/thorin";
import Gap from "../components/Gap";

import { useHistory } from "react-router-dom";
import { ReactComponent as SeamlessLogo } from "../assets/imgs/SeamlessLogo.svg";
import { largerThan } from "../utils/styledComponents";
import { theme } from "../components/theme";

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

const WrappedSubTitle = styled.div`
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

  const [configItems, setConfigItems] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const readItems = await fetch(
          `https://edge-config.vercel.com/${process.env.REACT_APP_CONFIG_ID}?token=${process.env.REACT_APP_VERCEL_TOKEN}`
          //"https://edge-config.vercel.com/ecfg_3eh8clg3msruczzvmbieqmmzll7r?token=14cadaad-72c1-4b8d-ad12-56d7b7f8f33f"
        );
        const result = await readItems.json();
        console.log("result", result);

        if (result.items) {
          setConfigItems(result.items);
        } else {
          console.error("Unexpected API response format");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleClick = () => {
    history.push("/delegate-ranking");
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
      <WrappedSubTitle fontSize={8}>
        edge config key: greeting, value: {configItems.greeting}
      </WrappedSubTitle>
      <WrappedSubTitle fontSize={8}>
        edge config key: seam, value: {configItems.seam}
      </WrappedSubTitle>
      <Gap height={4} />
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
