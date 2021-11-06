import React, { useEffect, useState } from "react";
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
  Statistic,
  SubsubTitle,
} from "../components/text";
import Gap from "../components/Gap";
import { useHistory } from "react-router-dom";
import { largerThan } from "../utils/styledComponents";

import SplashENSLogo from "../assets/imgs/SplashENSLogo.svg";
import Divider from "../components/Divider";
import Pill from "../components/Pill";
import { CTAButton } from "../components/buttons";
import Profile from "../components/Profile";
import { hasClaimed } from "../utils/tokenClaim";

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

const ENSLogo = styled.img`
  width: 40px;
  margin-left: 5px;
  marign-top: 0px;
`;

const SmallENSLogo = styled(ENSLogo)`
  width: 25px;
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

const Dashboard = () => {
  const {
    data: { address, addressDetails },
  } = useQuery(gql`
    query getHeaderData @client {
      address
      addressDetails
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

  const history = useHistory();

  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    hasClaimed(address)
      .then((result) => setIsClaimed(result))
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
              <StatsNumber>{pastTokens}</StatsNumber>
              <SmallENSLogo src={SplashENSLogo} />
            </NumberWithLogoContainer>
          </StatsRow>
          <Divider />
          <StatsRow>
            <RowLabel>Future registration </RowLabel>
            <NumberWithLogoContainer>
              <StatsNumber>{futureTokens}</StatsNumber>
              <SmallENSLogo src={SplashENSLogo} />
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
            <RowLabel>Longest owned </RowLabel>
            <NumberWithLogoContainer>
              <StatsNumber>{longestOwnedName}</StatsNumber>
            </NumberWithLogoContainer>
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
          {rawBalance ? (
            <Pill
              text={
                isClaimed
                  ? "You were eligible for the airdrop!"
                  : "You are eligible for the airdrop!"
              }
            />
          ) : (
            <Pill error text={"You are not eligible for the airdrop"} />
          )}

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
                <ENSLogo src={SplashENSLogo} />
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
                    isClaimed
                      ? "Tokens claimed successfully"
                      : "Start your claim process"
                  }
                  onClick={() => !isClaimed && history.push("/why")}
                  type={isClaimed ? "disabled" : ""}
                />
              </>
            )}
          </ContentBox>
        </NarrowColumn>
      </RightContainer>
    </ClaimEnsTokenContainer>
  );
};

export default Dashboard;
