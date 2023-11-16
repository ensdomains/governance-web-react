import React from "react";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import styled from "styled-components";

import {
  ContentBox,
  InnerContentBox,
  NarrowColumn,
} from "../components/layout";
import {
  Content,
  DecimalBalance,
  Header,
  IntegerBalance,
  Link,
  Statistic,
  SubsubTitle,
} from "../components/text";
import Gap from "../components/Gap";
import { useHistory } from "react-router-dom";
import { largerThan } from "../utils/styledComponents";

import { ReactComponent as SeamlessLogo } from "../assets/imgs/SeamlessLogo.svg";
import Divider from "../components/Divider";
import Pill from "../components/Pill";
import { CTAButton } from "../components/buttons";
import Profile from "../components/Profile";

const ClaimEnsTokenContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;

  ${largerThan.tablet`
        flex-direction: row;
    `}
`;

const LeftContainer = styled.div`
  min-width: 350px;
`;

const RightContainer = styled.div`
  margin-bottom: 50px;
  ${largerThan.tablet`
        margin-left: 50px;
        margin-bottom: 0px;
    `}
`;

const ENSLogo = styled(SeamlessLogo)`
  width: 40px;
  height: 40px;
  margin-left: 5px;
  marign-top: 0px;
`;

const SmallENSLogo = styled(ENSLogo)`
  width: 25px;
  height: 25px;
  margin-top: 1px;
  margin-left: 5px;
  margin-right: -4px;
`;

const StatsSubtitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.01em;
  color: #717171;
  opacity: 0.6;
`;

const RowLabel = styled.div`
  letter-spacing: -0.01em;
  font-style: normal;
  font-weight: bold;
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

const StatsSection = styled.div`
  margin-bottom: 35px;
`;

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

const WrappedContent = styled(Content)`
  color: #1a1a1a;
`;

const AdditionalSubtitle = styled(SubsubTitle)`
  margin-left: 10px;
`;

const AdditionalHeader = styled(Header)`
  font-size: 20px;
`;

const AdditionalIntegerBalance = styled(IntegerBalance)`
  font-size: 20px;
  line-height: 24px;
`;

const AdditionalDecimalBalance = styled(DecimalBalance)`
  font-size: 20px;
  line-height: 24px;
`;

const AdditionalLink = styled(Link)`
  font-size: 20px;
`;

const AdditionalContent = styled(Content)`
  font-size: 14px;
`;

const EndAlignedCTAButton = styled(CTAButton)`
  align-self: flex-end;
`;

const Dashboard = () => {
  const {
    data: { address, addressDetails, ep2AddressDetails, network },
  } = useQuery(gql`
    query getHeaderData @client {
      address
      addressDetails
      ep2AddressDetails
      network
    }
  `);

  const {
    lastExpiringName,
    longestOwnedName,
    pastTokens,
    futureTokens,
    balance,
    rawBalance,
    hasReverseRecord,
    eligible,
  } = addressDetails;

  const {
    shortBalance: ep2Balance,
    rawBalance: ep2RawBalance,
    eligible: ep2Eligible,
  } = ep2AddressDetails;

  const history = useHistory();

  return (
    <ClaimEnsTokenContainer>
      <LeftContainer>
        {address && <Profile large {...{ address }} />}
        <Gap height={3} />
        <StatsSection>
          <StatsRow>
            <StatsSubtitle>Rewards</StatsSubtitle>
          </StatsRow>
          <Divider />
          <StatsRow>
            <RowLabel>Historical activity </RowLabel>
            <NumberWithLogoContainer>
              <StatsNumber>
                {hasReverseRecord ? (pastTokens / 2).toFixed(2) : pastTokens}
              </StatsNumber>
              <SmallENSLogo />
            </NumberWithLogoContainer>
          </StatsRow>
          <Divider />
          <StatsRow>
            <RowLabel>Future registration </RowLabel>
            <NumberWithLogoContainer>
              <StatsNumber>
                {hasReverseRecord
                  ? (futureTokens / 2).toFixed(2)
                  : futureTokens}
              </StatsNumber>
              <SmallENSLogo />
            </NumberWithLogoContainer>
          </StatsRow>
          {hasReverseRecord && (
            <>
              <Divider />
              <StatsRow>
                <RowLabel>Primary ENS Name set </RowLabel>
                <NumberWithLogoContainer>
                  <StatsNumber>2x</StatsNumber>
                </NumberWithLogoContainer>
              </StatsRow>
            </>
          )}
        </StatsSection>

        <StatsSection>
          <StatsRow>
            <StatsSubtitle>Fun facts</StatsSubtitle>
          </StatsRow>
          <Divider />
          <StatsRow>
            <RowLabel>Latest expiration </RowLabel>
            <NumberWithLogoContainer>
              <StatsNumber>{lastExpiringName}</StatsNumber>
            </NumberWithLogoContainer>
          </StatsRow>
        </StatsSection>
      </LeftContainer>

      <RightContainer>
        <NarrowColumn>
          {eligible ? (
            <Pill text="You were eligible for the airdrop!" />
          ) : (
            <Pill error text={"You were not eligible for the airdrop"} />
          )}
          <ContentBox>
            <Header>Past Airdrop</Header>
            <Gap height={3} />
            <WrappedContent>
              {rawBalance
                ? "You were eligible for the retroactive airdrop."
                : "This Ethereum account was not eligible for the airdrop."}
            </WrappedContent>
            <Gap height={5} />
            <InnerContentBox>
              <SubsubTitle>
                {rawBalance && "You were eligible for..."}
              </SubsubTitle>
              <Gap height={2} />
              <Statistic>
                <IntegerBalance>{balance?.split(".")[0]}</IntegerBalance>
                <DecimalBalance>.{balance?.split(".")[1]}</DecimalBalance>
                <ENSLogo />
              </Statistic>
            </InnerContentBox>
            <Gap height={5} />
            {eligible && (
              <>
                <WrappedContent>
                  You qualified to receive these tokens for being an early
                  participant of the ENS community. Use this power wisely!
                </WrappedContent>
                <Gap height={5} />
                <CTAButton text="Airdrop finished" type="disabled" />
              </>
            )}
          </ContentBox>
          <Gap height={6} />
          {
            <AdditionalSubtitle>
              {ep2Eligible
                ? "This Ethereum account was eligible for additional token claims."
                : "This Ethereum account was not eligible for additional token claims."}
            </AdditionalSubtitle>
          }
          <Gap height={ep2Eligible ? 3 : 0} />
        </NarrowColumn>
      </RightContainer>
    </ClaimEnsTokenContainer>
  );
};

export default Dashboard;
