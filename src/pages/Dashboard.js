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
  Header,
  IntegerBalance,
  Statistic,
} from "../components/text";
import Gap from "../components/Gap";
import { largerThan } from "../utils/styledComponents";
import { useHistory } from "react-router-dom";

import { ReactComponent as SeamlessLogo } from "../assets/imgs/SeamlessLogo.svg";
import Divider from "../components/Divider";
import Pill from "../components/Pill";
import { CTAButton } from "../components/buttons";
import Profile from "../components/Profile";
const merkleTreeData = require('../root.json'); 

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
  margin-top: 0px;
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

const NumberWithLogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const WrappedContent = styled(Content)`
  color: #1a1a1a;
`;

const Dashboard = () => {
  const history = useHistory();

  const {
    data: { address },
  } = useQuery(gql`
    query getHeaderData @client {
      address
    }
  `);

  const eligible = merkleTreeData[address] !== undefined;
  const balance = merkleTreeData[address];

  const handleClick = () => {
     history.push("/why");
  };

  return (
    <ClaimEnsTokenContainer>
      <LeftContainer>
        { address && <Profile large {...{ address }} />} 
        <Gap height={4} />

{
/*
    Hardcode 0.1 and 0.9 until we know exact proportions
*/
}
        <StatsSection>
          <StatsRow>
            <StatsSubtitle>Rewards</StatsSubtitle>
          </StatsRow>
          <Divider />
          <StatsRow>
            <RowLabel>SEAM</RowLabel>
            <NumberWithLogoContainer>
              { balance * 0.1 }
              <SmallENSLogo />
            </NumberWithLogoContainer>
          </StatsRow>
          <Divider />

          <StatsRow>
            <RowLabel>Escrow SEAM</RowLabel>
              <NumberWithLogoContainer>
                { balance * 0.9 }
                <SmallENSLogo />
              </NumberWithLogoContainer>
          </StatsRow>
          
        </StatsSection>

      </LeftContainer>

      <RightContainer>
        <NarrowColumn>
          { eligible ? ( 
             <Pill text="You were eligible for the airdrop!" /> 
           ) : ( 
             <Pill error text={"You were not eligible for the airdrop"} /> 
          )} 
          <ContentBox>
            <Header>Claim your tokens</Header>
            <Gap height={5} />
            <InnerContentBox>
              <Gap height={2} />
              <Statistic>
                 <IntegerBalance>{balance}</IntegerBalance> 
                 {/* <IntegerBalance>{balance?.split(".")[0]}</IntegerBalance>  */}
                 {/* <DecimalBalance>.{balance?.split(".")[1]}</DecimalBalance>  */}
                <ENSLogo />
              </Statistic>
            </InnerContentBox>
            <Gap height={5} />
            { eligible && (
              <>
                <WrappedContent>
                  You qualified to receive these tokens for being an early
                  participant of the SEAM community. Use this power wisely!
                </WrappedContent>
                <Gap height={5} />
                <CTAButton text="Start your claiming process" onClick={handleClick}/>
              </>
            )}
          </ContentBox>
          <Gap height={6} />
        </NarrowColumn>
      </RightContainer>
    </ClaimEnsTokenContainer>
  );
};

export default Dashboard;
