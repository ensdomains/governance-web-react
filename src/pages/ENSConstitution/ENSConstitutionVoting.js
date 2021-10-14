import React, {useState, useEffect} from 'react';
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
import Footer from "./ENSConstitutionFooter";
import Summary from "./ENSConstitutionSummary";
import ENSConstitutionInfo from "./ENSConstitutionInfo";

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
    const [currentStep, setCurrentStep] = useState(-1)
    const totalSteps = getTotalNumberOfArticles()

    useEffect(() => {
        if(getEarliestUnvotedArticle() > 0) {
            setCurrentStep(getEarliestUnvotedArticle())
        }
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
        if (currentStep > -1) {
            setCurrentStep(currentStep - 1)
            return;
        }
        history.push('/delegates')
    }

    const handleNext = () => {
        setCurrentStep(currentStep + 1)
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

    if (currentStep < 0) {
        return (
            <ENSConstitutionInfo {...{handleBack, handleNext, currentStep, setCurrentStep}} />
        )
    }

    if (currentStep >= 0 && currentStep < totalSteps) {
        return (
            <NarrowColumn>
                <Voting {...{
                    currentStep,
                    setCurrentStep,
                    totalSteps,
                    article,
                    handleBack,
                    handleApproveVote,
                    handleRejectVote
                }}/>
            </NarrowColumn>
        )
    }

    if (currentStep >= 0 && currentStep >= totalSteps) {
        return (
            <NarrowColumn>
                <Summary {...{
                    currentStep,
                    setCurrentStep,
                    constitution,
                }}/>
            </NarrowColumn>
        )
    }
};

export default EnsConstitutionVoting;
