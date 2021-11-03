import React, { useEffect, useState } from "react";
import { Client } from "@snapshot-labs/snapshot.js";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import {
  ContentBox,
  InnerContentBox,
  NarrowColumn,
} from "../components/layout";
import {
  DecimalBalance,
  Header,
  IntegerBalance,
  Statistic,
  SubsubTitle,
} from "../components/text";
import Gap from "../components/Gap";
import { getEthersProvider } from "../web3modal";
import { imageUrl, shortenAddress } from "../utils/utils";
import { CTAButton } from "../components/buttons";
import SplashENSLogo from "../assets/imgs/SplashENSLogo.svg";
import { getDelegateChoice } from "./ENSConstitution/delegateHelpers";

const ENSLogo = styled.img`
  width: 40px;
  margin-left: 10px;
`;

const AvatarImg = styled.img`
  border-radius: 50%;
  width: ${(p) => (p.large ? "60px" : "50px")};
  height: ${(p) => (p.large ? "60px" : "50px")};
  margin-right: 10px;
`;

const WrappedInnerContentBox = styled(InnerContentBox)`
  display: flex;
`;

const LeftContainer = styled.div`
  flex: 1;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DelegateInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DelegateName = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 26px;
  line-height: 141%;
  color: #000000;
`;

const DelegateConfirmation = () => {
  const {
    data: { isConnected },
  } = useQuery(gql`
    query privateRouteQuery @client {
      isConnected
    }
  `);
  const [delegateInfo, setDelegateInfo] = useState({
    avatar: "",
    displayName: "",
  });
  const history = useHistory();

  useEffect(() => {
    const run = async () => {
      const delegateChoice = getDelegateChoice();

      if (!delegateChoice) {
        console.error("No delegate selected");
        return;
      }

      if (delegateChoice.includes(".")) {
        const resolver = await getEthersProvider().getResolver(delegateChoice);
        const avatar = await resolver.getText("avatar");
        setDelegateInfo({
          avatar,
          displayName: delegateChoice,
        });
        return;
      }

      const ethName = await getEthersProvider().lookupAddress(delegateChoice);
      if (ethName) {
        const resolver = await getEthersProvider().getResolver(ethName);
        const avatar = await resolver.getText("avatar");
        setDelegateInfo({
          avatar,
          displayName: ethName,
        });
        return;
      }

      setDelegateInfo({
        avatar: null,
        displayName: delegateChoice,
      });
    };
    if (isConnected) {
      run();
    }
  }, [isConnected]);

  return (
    <WrappedInnerContentBox>
      <LeftContainer>
        <SubsubTitle>You're delegating to</SubsubTitle>
        <Gap height={2} />
        <DelegateInfoContainer>
          {delegateInfo.avatar && (
            <AvatarImg
              src={imageUrl(delegateInfo.avatar, delegateInfo.displayName, 1)}
            />
          )}
          <DelegateName>
            {shortenAddress(delegateInfo.displayName)}
          </DelegateName>
        </DelegateInfoContainer>
      </LeftContainer>
      <RightContainer>
        <CTAButton
          onClick={() => {
            history.push("/delegates");
          }}
          type={"deny"}
          text={"Edit"}
        />
      </RightContainer>
    </WrappedInnerContentBox>
  );
};

const EnsSummary = () => {
  const {
    data: { address, addressDetails },
  } = useQuery(gql`
    query privateRouteQuery @client {
      address
      addressDetails
      isConnected
    }
  `);
  const history = useHistory();

  const { balance } = addressDetails;

  return (
    <NarrowColumn>
      <ContentBox>
        <Header>Review your claim</Header>
        <Gap height={3} />
        <InnerContentBox>
          <SubsubTitle>You will receive</SubsubTitle>
          <Gap height={1} />
          <Statistic>
            <IntegerBalance>{balance?.split(".")[0]}</IntegerBalance>
            <DecimalBalance>.{balance?.split(".")[1]}</DecimalBalance>
            <ENSLogo src={SplashENSLogo} />
          </Statistic>
        </InnerContentBox>
        <Gap height={3} />
        <DelegateConfirmation />
        <Gap height={5} />
        <CTAButton
          onClick={() => {
            history.push({
              pathname: "/summary/claim",
              state: "CLAIM",
            });
          }}
          text={"Claim"}
        />
      </ContentBox>
    </NarrowColumn>
  );
};

export default EnsSummary;
