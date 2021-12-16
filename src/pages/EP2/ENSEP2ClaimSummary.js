import React from "react";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";

import Footer from "../../components/Footer";
import {
  Content,
  DecimalBalance,
  Header,
  IntegerBalance,
  Statistic,
  SubsubTitle,
} from "../../components/text";
import {
  ContentBox,
  InnerContentBox,
  NarrowColumn,
} from "../../components/layout";
import Gap from "../../components/Gap";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as SplashENSLogo } from "../../assets/imgs/SplashENSLogo.svg";

const ENSLogo = styled(SplashENSLogo)`
  width: 40px;
  height: 40px;
  margin-left: 5px;
  marign-top: 0px;
`;

const ClaimType = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 26px;
  line-height: 141%;
  color: #000000;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ENSEP2ClaimSummary = () => {
  const {
    data: { ep2AddressDetails },
  } = useQuery(gql`
    query privateRouteQuery @client {
      isConnected
      address
      ep2AddressDetails
    }
  `);
  const { balance } = ep2AddressDetails;
  const history = useHistory();

  return (
    <NarrowColumn>
      <ContentBox>
        <Header>Review your claim</Header>
        <Gap height={3} />
        <Content>
          Please make sure that the following details look correct.
        </Content>
        <Gap height={6} />
        <InnerContentBox>
          <SubsubTitle>You will receive</SubsubTitle>
          <Gap height={2} />
          <Statistic>
            <IntegerBalance>{balance?.split(".")[0]}</IntegerBalance>
            <DecimalBalance>.{balance?.split(".")[1]}</DecimalBalance>
            <ENSLogo />
          </Statistic>
        </InnerContentBox>
        <Gap height={3} />
        <InnerContentBox>
          <SubsubTitle>You are claiming</SubsubTitle>
          <Gap height={2} />
          <ClaimType>EP2 Retrospective</ClaimType>
        </InnerContentBox>
      </ContentBox>
      <Footer
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/dashboard");
        }}
        rightButtonText="Claim"
        rightButtonCallback={() => {
          history.push({
            pathname: "/ep2/claim",
            state: "EP2CLAIM",
          });
        }}
      />
    </NarrowColumn>
  );
};

export default ENSEP2ClaimSummary;
