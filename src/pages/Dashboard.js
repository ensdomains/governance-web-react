import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import styled from "styled-components";

import {
  ContentBox,
  ContentBoxWithColumns,
  InnerContentBox,
  InnerContentBoxColumn,
  InnerContentBoxRow,
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
  SubTitle,
} from "../components/text";
import Gap from "../components/Gap";
import { useHistory } from "react-router-dom";
import { largerThan } from "../utils/styledComponents";

import { ReactComponent as SplashENSLogo } from "../assets/imgs/SplashENSLogo.svg";
import Divider from "../components/Divider";
import Pill from "../components/Pill";
import { CTAButton } from "../components/buttons";
import Profile from "../components/Profile";
import { hasClaimed } from "../utils/token";

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

const ENSLogo = styled(SplashENSLogo)`
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

  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaimedLoading, setIsClaimedLoading] = useState(true);

  const [isClaimedEp2, setIsClaimedEp2] = useState(false);
  const [isClaimedEp2Loading, setIsClaimedEp2Loading] = useState(true);

  useEffect(() => {
    hasClaimed(address)
      .then((result) => {
        setIsClaimed(result);
        setIsClaimedLoading(false);
      })
      .then(() => hasClaimed(address, "ep2"))
      .then((result) => {
        console.log(result);
        setIsClaimedEp2(result);
        setIsClaimedEp2Loading(false);
      })
      .catch((error) => {
        console.error("error checking hasClaimed: ", error);
      });
  }, [address]);

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
          {isClaimedLoading === false && eligible !== undefined ? (
            eligible ? (
              <Pill
                text={
                  isClaimed
                    ? "You were eligible for the airdrop!"
                    : "You are eligible for the airdrop!"
                }
              />
            ) : (
              <Pill error text={"You are not eligible for the airdrop"} />
            )
          ) : null}

          <ContentBox>
            <Header>
              {isClaimed && rawBalance
                ? "Your tokens are claimed!"
                : "Claim your tokens"}
            </Header>
            <Gap height={3} />
            <WrappedContent>
              {rawBalance
                ? isClaimed
                  ? "You were eligible for the retroactive airdrop, and you successfully claimed your tokens."
                  : "You are eligible for the airdrop! View your tokens below, and start the claim process."
                : "This Ethereum account is not eligible for the airdrop. Please make sure you are connected with the right account."}
            </WrappedContent>
            <Gap height={5} />
            <InnerContentBox>
              <SubsubTitle>
                {rawBalance && isClaimed
                  ? "You received..."
                  : "You will receive..."}
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
                  You have received these tokens for being an early participant
                  of the ENS community. Use this power wisely!
                </WrappedContent>
                <Gap height={5} />
                <CTAButton
                  text={
                    isClaimedLoading
                      ? "Checking claim status..."
                      : isClaimed
                      ? "Tokens claimed successfully"
                      : "Start your claim process"
                  }
                  onClick={() => !isClaimed && history.push("/why")}
                  type={isClaimed || isClaimedLoading ? "disabled" : ""}
                />
              </>
            )}
          </ContentBox>
          <Gap height={6} />
          <AdditionalSubtitle>
            {ep2Eligible
              ? "Additional token claims"
              : "This Ethereum account is not eligible for any additional token claims."}
          </AdditionalSubtitle>
          <Gap height={ep2Eligible ? 3 : 0} />
          {ep2Eligible && (
            <ContentBox>
              <InnerContentBoxRow>
                <AdditionalHeader>EP2 Retrospective</AdditionalHeader>
                <AdditionalLink href="https://snapshot.org/#/ens.eth/proposal/0xcf77c74696cab1d939936ae8684c0007297bed641f60896ad186354f036d725f">
                  Learn More
                </AdditionalLink>
              </InnerContentBoxRow>
              <Gap height={2} />
              <AdditionalContent>
                Based on the EP2 DAO proposal, this is a retrospective airdrop
                for those that did not receive the 2x multiplier, despite owning
                a name that was used as a primary ENS name.
              </AdditionalContent>
              <Gap height={3} />
              <InnerContentBoxRow>
                <InnerContentBoxColumn>
                  <SubsubTitle>
                    {isClaimedEp2 ? "Claimed tokens" : "Claimable tokens"}
                  </SubsubTitle>
                  <Gap height={1} />
                  <Statistic>
                    <AdditionalIntegerBalance>
                      {ep2Balance?.split(".")[0]}
                    </AdditionalIntegerBalance>
                    <AdditionalDecimalBalance>
                      .{ep2Balance?.split(".")[1]}
                    </AdditionalDecimalBalance>
                    <SmallENSLogo />
                  </Statistic>
                </InnerContentBoxColumn>
                <EndAlignedCTAButton
                  onClick={() => !isClaimedEp2 && history.push("/ep2/summary")}
                  text={isClaimedEp2 ? "Claimed" : "Claim"}
                  type={isClaimedEp2 ? "disabled" : ""}
                />
              </InnerContentBoxRow>
            </ContentBox>
          )}
        </NarrowColumn>
      </RightContainer>
    </ClaimEnsTokenContainer>
  );
};

export default Dashboard;
