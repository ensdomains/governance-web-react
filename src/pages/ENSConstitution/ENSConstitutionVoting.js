import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {useHistory} from "react-router-dom";

import {
    getConstitution,
    getEarliestUnvotedArticle,
    getTotalNumberOfArticles, isCompleted,
    voteOnArticle
} from "./constitutionHelpers";
import {ContentBoxWithHeader, NarrowColumn} from "../../components/layout";
import SectionHeader from "./SectionHeader";
import ComponentFooter from "../../components/Footer";
import Footer from "./ENSConstitutionFooter";
import theme from "../../components/theme";
import Summary from "./ENSConstitutionSummary";

const AritcleHeader = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 141%;
    letter-spacing: -0.01em;
    color: #424242;  
`

const ArticleContent = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 141%;
    letter-spacing: -0.01em;
    color: #606060;
`

const ContentContainer = styled.div`
    display: grid;
    gap: 15px;
`

const useConstitutionSteps = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const totalSteps = getTotalNumberOfArticles()

    useEffect(() => {
        setCurrentStep(getEarliestUnvotedArticle())
    }, [])

    return ({currentStep, setCurrentStep, totalSteps})
}

const Voting = ({currentStep, setCurrentStep, totalSteps, article, handleBack, handleApproveVote, handleRejectVote}) => (
    <>
        <ContentBoxWithHeader
            HeaderComponent={<SectionHeader {...{currentStep, setCurrentStep, totalSteps}}/>}
        >
            <ContentContainer>
                <AritcleHeader>{article.title}</AritcleHeader>
                <ArticleContent>{article.content}</ArticleContent>
                <ArticleContent><b>Permissable: </b>{article.positiveExample}</ArticleContent>
                <ArticleContent><b>Not permissable: </b>{article.negativeExample}</ArticleContent>
            </ContentContainer>
        </ContentBoxWithHeader>
        <Footer
            backCallback={handleBack}
            approveVoteCallback={handleApproveVote}
            rejectVoteCallback={handleRejectVote}
        />
    </>
)



const EnsConstitutionVoting = () => {
    const history = useHistory();
    const {currentStep, setCurrentStep, totalSteps} = useConstitutionSteps()
    const constitution = getConstitution()
    const article = constitution?.[currentStep]

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            return;
        }
        history.push('/constitution')
    }

    const handleVote = (vote) => {
        voteOnArticle(currentStep, vote)
        setCurrentStep(currentStep + 1)
    }

    const handleApproveVote = () => {
        handleVote(true)
    }

    const handleRejectVote = () => {
        handleVote(false)
    }

    useEffect(() => {
        if (isCompleted()) {
            setCurrentStep(4)
        }
    }, [])

    return (
        <NarrowColumn>
            {(currentStep >= totalSteps)
                ? <Summary {...{
                    currentStep,
                    setCurrentStep,
                    constitution,
                }}/>
                : <Voting {...{
                    currentStep,
                    setCurrentStep,
                    totalSteps,
                    article,
                    handleBack,
                    handleApproveVote,
                    handleRejectVote
                }}/>
            }
        </NarrowColumn>
    );
};

export default EnsConstitutionVoting;
