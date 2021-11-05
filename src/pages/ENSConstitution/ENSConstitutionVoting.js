import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

import {
  getConstitution,
  getEarliestUnvotedArticle,
  getTotalNumberOfArticles,
  isCompleted,
  voteOnArticle,
} from "./constitutionHelpers";
import { ContentBoxWithHeader, NarrowColumn } from "../../components/layout";
import SectionHeader from "./SectionHeader";
import Footer from "./ENSConstitutionFooter";
import Summary from "./ENSConstitutionSummary";
import ENSConstitutionInfo from "./ENSConstitutionInfo";

const AritcleHeader = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 141%;
  letter-spacing: -0.01em;

  color: #1a1a1a; ;
`;

const ArticleContent = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 141%;
  letter-spacing: -0.01em;
  color: #1a1a1a;
  padding: ${(p) => {
    switch (p.type) {
      case "permissible":
        return "14px";
      case "forbidden":
        return "14px";
      default:
        return "0px";
    }
  }};
  border-radius: 10px;
  background: ${(p) => {
    switch (p.type) {
      case "permissible":
        return "rgba(73, 179, 147, 0.1)";
      case "forbidden":
        return "rgba(213, 85, 85, 0.1)";
      default:
        return "initial";
    }
  }};
`;

const ContentContainer = styled.div`
  display: grid;
  gap: 15px;
`;

const Permissible = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 19px;

  display: flex;
  align-items: center;

  color: #49b393;
  margin-bottom: 5px;
`;

const Forbidden = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 19px;

  display: flex;
  align-items: center;

  color: #d55555;
  margin-bottom: 5px;
`;

const useConstitutionSteps = (account) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const totalSteps = getTotalNumberOfArticles(account);

  useEffect(() => {
    if (getEarliestUnvotedArticle(account) > 0) {
      setCurrentStep(getEarliestUnvotedArticle(account));
    }
  }, []);

  return { currentStep, setCurrentStep, totalSteps };
};

const Voting = ({
  currentStep,
  setCurrentStep,
  totalSteps,
  article,
  handleBack,
  handleApproveVote,
  handleRejectVote,
  account,
}) => (
  <>
    <ContentBoxWithHeader
      HeaderComponent={
        <SectionHeader
          {...{ account, currentStep, setCurrentStep, totalSteps }}
        />
      }
    >
      <ContentContainer>
        <AritcleHeader>{article.title}</AritcleHeader>
        <ArticleContent>{article.content}</ArticleContent>
        <ArticleContent type={"permissible"}>
          <Permissible>Permissable: </Permissible>
          {article.positiveExample}
        </ArticleContent>
        <ArticleContent type={"forbidden"}>
          <Forbidden>Not permissable: </Forbidden>
          {article.negativeExample}
        </ArticleContent>
      </ContentContainer>
    </ContentBoxWithHeader>
    <Footer
      backCallback={handleBack}
      approveVoteCallback={handleApproveVote}
      rejectVoteCallback={handleRejectVote}
    />
  </>
);

const EnsConstitutionVoting = ({ account }) => {
  const history = useHistory();
  const { currentStep, setCurrentStep, totalSteps } =
    useConstitutionSteps(account);
  const constitution = getConstitution(account);
  const article = constitution?.[currentStep];

  const handleBack = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1);
      return;
    }
    history.push("/governance");
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleVote = (vote) => {
    voteOnArticle(account, currentStep, vote);
    setCurrentStep(currentStep + 1);
  };

  const handleApproveVote = () => {
    handleVote(true);
  };

  const handleRejectVote = () => {
    handleVote(false);
  };

  useEffect(() => {
    if (isCompleted(account)) {
      setCurrentStep(4);
    }
  }, [account]);

  if (currentStep < 0) {
    return (
      <ENSConstitutionInfo
        {...{ account, handleBack, handleNext, currentStep, setCurrentStep }}
      />
    );
  }

  if (currentStep >= 0 && currentStep < totalSteps) {
    return (
      <NarrowColumn>
        <Voting
          {...{
            account,
            currentStep,
            setCurrentStep,
            totalSteps,
            article,
            handleBack,
            handleApproveVote,
            handleRejectVote,
          }}
        />
      </NarrowColumn>
    );
  }

  if (currentStep >= 0 && currentStep >= totalSteps) {
    return (
      <NarrowColumn>
        <Summary
          {...{
            currentStep,
            setCurrentStep,
            constitution,
          }}
        />
      </NarrowColumn>
    );
  }
};

const EnsConstitutionVotingContainer = () => {
  const {
    data: { address },
  } = useQuery(gql`
    query getAddress @client {
      address
    }
  `);

  if (!address) return null;
  return (
    <EnsConstitutionVoting
      account={"0x866B3c4994e1416B7C738B9818b31dC246b95eEE"}
    />
  );
};

export default EnsConstitutionVotingContainer;
