import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';

import {
    getConstitution,
    getEarliestUnvotedArticle,
    getTotalNumberOfArticles,
    voteOnArticle
} from "./constitutionHelpers";
import {ContentBoxWithHeader, NarrowColumn} from "../../components/layout";
import SectionHeader from "./SectionHeader";
import {useHistory} from "react-router-dom";
import Footer from "./ENSConstitutionFooter";


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
    gap: 20px;
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

const Summary = () => {
    return (
        <div>Summary</div>
    )
}

const EnsConstitutionVoting = () => {
    const history = useHistory();
    const {currentStep, setCurrentStep, totalSteps} = useConstitutionSteps()
    const article = getConstitution()?.[currentStep]

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep)
            return;
        }
        history.push('/constitution')
    }

    const handleVote = (vote) => {
        voteOnArticle(currentStep, vote)
        if (currentStep >= totalSteps - 1) {
            //history.push('/constitution/summary')
            return
        }
        setCurrentStep(currentStep + 1)
    }

    const handleApproveVote = () => {
        handleVote(true)
    }

    const handleRejectVote = () => {
        handleVote(false)
    }

    console.log('currentStep: ', currentStep)

    return (
        <NarrowColumn>
            {(currentStep >= totalSteps)
                ? <Summary />
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
