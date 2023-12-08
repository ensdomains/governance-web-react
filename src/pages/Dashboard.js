import React, {useEffect, useState} from "react";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import styled from "styled-components";
import SeamAidrop from "../assets/abis/SeamAirdrop.json";
import {
  ContentBox,
  InnerContentBox,
  NarrowColumn,
} from "../components/layout";
import { Content, Header, IntegerBalance, Statistic } from "../components/text";
import Gap from "../components/Gap";
import { largerThan } from "../utils/styledComponents";
import { useHistory } from "react-router-dom";

import { ReactComponent as SeamlessLogo } from "../assets/imgs/SeamlessLogo.svg";
import Divider from "../components/Divider";
import Pill from "../components/Pill";
import { CTAButton } from "../components/buttons";
import Profile from "../components/Profile";
import { Contract } from "ethers";
import { getEthersProvider } from "../web3modal";
import { maxVestingPercentage } from "../utils/consts";
const ethereumjs = require("ethereumjs-util");
const merkleTreeData = require("../root.json");
import { BigNumber } from "ethers";

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

const SeamLogo = styled(SeamlessLogo)`
  width: 40px;
  height: 40px;
  margin-left: 5px;
  margin-top: 0px;
`;

const SmallSeamLogo = styled(SeamlessLogo)`
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

const Dashboard =  () => {
  const history = useHistory();
  const [eligible, setEligible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [vestingPercentage, setVestedPercentage] = useState(0);

  const {
    data: { address },
  } = useQuery(gql`
    query getHeaderData @client {
      address
    }
  `);

  useEffect(async() => {
    const provider = await getEthersProvider();
    const seamAirdrop = new Contract(
      SeamAidrop.address,
      SeamAidrop.abi,
      provider
    );

    const checksumedAddress = ethereumjs.toChecksumAddress(address);
    const isClaimed = await seamAirdrop.hasClaimed(checksumedAddress);
    const isEligible = merkleTreeData[checksumedAddress] !== undefined && !isClaimed;
    setEligible(isEligible);
    setBalance(isEligible ? merkleTreeData[checksumedAddress] : 0);
    setVestedPercentage(await seamAirdrop.vestingPercentage());
  }, [address]);

  const handleClick = () => {
    history.push("/why");
  };

  return (
    <ClaimEnsTokenContainer>
      <LeftContainer>
        {address && <Profile large {...{ address }} />}
        <Gap height={4} />
        <StatsSection>
          <StatsRow>
            <StatsSubtitle>Rewards</StatsSubtitle>
          </StatsRow>
          <Divider />
          {
            vestingPercentage != maxVestingPercentage && 
            <>
            <StatsRow>
              <RowLabel>SEAM</RowLabel>
              <NumberWithLogoContainer>
                {balance * (maxVestingPercentage - vestingPercentage) / maxVestingPercentage}
                <SmallSeamLogo />
              </NumberWithLogoContainer>
            </StatsRow> 
            <Divider />
            </>
          }
          {
            vestingPercentage != 0 &&
            <StatsRow>
              <RowLabel>Escrow SEAM</RowLabel>
              <NumberWithLogoContainer>
                {balance * vestingPercentage / maxVestingPercentage}
                <SmallSeamLogo />
              </NumberWithLogoContainer>
            </StatsRow>
          }
        </StatsSection>
      </LeftContainer>

      <RightContainer>
        <NarrowColumn>
          {eligible ? (
            <Pill text="You are eligible for the airdrop!" />
          ) : (
            <Pill error text="You are not eligible for the airdrop" />
          )}
          <ContentBox>
            <Header>Claim your tokens</Header>
            <Gap height={5} />
            <InnerContentBox>
              <Gap height={2} />
              <Statistic>
                <IntegerBalance>{balance ?? 0}</IntegerBalance>
                <SeamLogo />
              </Statistic>
            </InnerContentBox>
            <Gap height={5} />
            {eligible && (
              <>
                <WrappedContent>
                  You’ve qualified to receive these tokens for participating in
                  important activities within the Seamless ecosystem. The future
                  is in your hands 🤝!
                </WrappedContent>
                <Gap height={5} />
                <CTAButton
                  text="Start your claiming process"
                  onClick={handleClick}
                />
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
