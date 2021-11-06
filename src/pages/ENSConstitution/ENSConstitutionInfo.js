import React from "react";
import styled from "styled-components";

import SectionHeader from "./SectionHeader";
import Footer from "../../components/Footer";
import { Content, Header } from "../../components/text";
import { ContentBoxWithHeader, NarrowColumn } from "../../components/layout";
import Gap from "../../components/Gap";
import Token from "../../components/Token";

const BlackBold = styled.b`
  color: black;
`;

const ENSConstitutionInfo = ({
  handleBack,
  handleNext,
  currentStep,
  setCurrentStep,
  account,
}) => {
  return (
    <NarrowColumn>
      <ContentBoxWithHeader
        HeaderComponent={
          <SectionHeader {...{ account, currentStep, setCurrentStep }} />
        }
      >
        <Header>Help shape the community</Header>
        <Gap height={3} />
        <Content>
          We have created an initial set of community guidelines for which you
          may vote for or against with your allocation of claimable <Token />.
          Voting is gas-free and conducted off-chain using{" "}
          <BlackBold>Snapshot</BlackBold>.
        </Content>
        <Gap height={3} />
        <Content>
          We hope these rules form the basis for a strong community.
        </Content>
        <Gap height={3} />
        <Content>
          Approval by two-thirds majority of votes cast in the first week is
          required to ratify a given article of the Constitution.
        </Content>
        <Gap height={3} />
        <Content>
          Future amendments may be made to this Constitution by two-thirds
          majority and at least 5% of all tokens participating.
        </Content>
        <Gap height={3} />
      </ContentBoxWithHeader>
      <Footer
        rightButtonText="Start"
        rightButtonCallback={handleNext}
        leftButtonText="Back"
        leftButtonCallback={handleBack}
      />
    </NarrowColumn>
  );
};

export default ENSConstitutionInfo;
