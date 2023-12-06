import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import Footer from "../components/Footer";
import Gap from "../components/Gap";
import { Header, Content } from "../components/text";
import { ContentBox } from "../components/layout";
import { largerThan } from "../utils/styledComponents";
import Divider from "../components/Divider";
import Token from "../components/Token";

const Container = styled.div`
  max-width: 920px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;

  ${largerThan.tablet`
        grid-template-columns: minmax(0,1fr) minmax(0,0.9fr);
        grid-template-rows: repeat(3, auto);
    `}
`;

const RowLabel = styled.div`
  letter-spacing: -0.01em;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #717171;
  display: flex;
  align-items: center;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
`;

const StatsSection = styled.div``;

const StatsNumber = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  color: #000000;
`;

const NumberWithLogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const WhatIsENSContentBox = styled(ContentBox)`
  grid-row-start: 1;
  grid-row-end: 3;
`;

const Why = () => {
  const history = useHistory();

  return (
    <Container>
      <WhatIsENSContentBox>
        <Header>What’s the latest with Seamless?</Header>
        <Gap height={3} />
        <Content>
          Seamless has been rapidly growing, thanks to users and community
          participants like yourself! Here’s some fun stats, as of December 1,
          2023:
        </Content>
        <Gap height={5} />
        <StatsSection>
          <StatsRow>
            <RowLabel>Unique wallets</RowLabel>
            <NumberWithLogoContainer>
              <StatsNumber>&gt;5,000</StatsNumber>
            </NumberWithLogoContainer>
          </StatsRow>
          <Divider />
          <StatsRow>
            <RowLabel>TVL ranking among native Base projects</RowLabel>
            <NumberWithLogoContainer>
              <StatsNumber>Top 5</StatsNumber>
            </NumberWithLogoContainer>
          </StatsRow>
          <Divider />
          <StatsRow>
            <RowLabel>Twitter followers</RowLabel>
            <NumberWithLogoContainer>
              <StatsNumber>&gt;65,000</StatsNumber>
            </NumberWithLogoContainer>
          </StatsRow>
        </StatsSection>
      </WhatIsENSContentBox>

      <ContentBox>
        <Header>How does SEAM work?</Header>
        <Gap height={3} />
        <Content>
          <Token /> is the utility token that governs Seamless Protocol. The
          community of SEAM holders may vote to adjust key protocol parameters,
          create new technical integrations, distribute liquidity mining rewards
          and MORE!
        </Content>
        <Gap height={5} />
        <Content>
          Each SEAM token counts as one vote. To activate the voting power of
          SEAM, a wallet must first delegate the tokens—this can be a
          self-delegation or a delegation to another wallet.
        </Content>
      </ContentBox>
      <ContentBox>
        <Header>How do I get started?</Header>
        <Gap height={3} />
        <Content>
          Follow this easy wizard to set up your vote delegation and claim your
          SEAM tokens.
        </Content>
      </ContentBox>
      <Footer
        grid
        rightButtonText="Next"
        rightButtonCallback={() => {
          history.push("/governance");
        }}
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/dashboard");
        }}
      />
    </Container>
  );
};

export default Why;
