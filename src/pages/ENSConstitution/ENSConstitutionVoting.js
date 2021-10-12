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

const SummaryArticleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const SummaryArticleLeftContianer = styled.div`

`

const SummaryArticleRightContianer = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 141%;
    /* identical to box height, or 23px */
    
    text-align: right;
    letter-spacing: -0.01em;
    
    color: #B8B8B8;
`

const SummaryArticleTitle = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    
    display: flex;
    align-items: center;
    letter-spacing: -0.01em;
    
    color: #989898;
    margin-bottom: 5px;
`

const SummaryArticleSummary = styled.div`
    max-width: 240px;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 130%;
    
    letter-spacing: -0.01em;
    
    color: #424242;
`

const Divider = styled.div`
    opacity: 0.05;
    border-bottom: 1px solid #000000;
    height: 0px;
    width: 100%;
`

const ForAgainst = styled.span`
    color: ${p => p.for ? theme.colors.green : theme.colors.red};
`

const SummaryArticle = ({title, vote}, idx, arr) => {
    return (
        <>
            <SummaryArticleContainer>
                <SummaryArticleLeftContianer>
                    <SummaryArticleTitle>
                        Article {idx + 1}
                    </SummaryArticleTitle>
                    <SummaryArticleSummary>
                        {title}
                    </SummaryArticleSummary>
                </SummaryArticleLeftContianer>
                <SummaryArticleRightContianer>
                    Voted <ForAgainst for={vote}>{vote ? 'for' : 'against'}</ForAgainst>
                </SummaryArticleRightContianer>
            </SummaryArticleContainer>
            {!(idx === arr.length-1) && <Divider/>}
        </>
    )
}

const Summary = ({currentStep, setCurrentStep, constitution}) => {
    return (
        <>
            <ContentBoxWithHeader
                HeaderComponent={<SectionHeader {...{currentStep, setCurrentStep}}/>}
            >
                <ContentContainer>
                    {constitution.map(SummaryArticle)}
                </ContentContainer>
            </ContentBoxWithHeader>
            {/*<Footer*/}
            {/*    backCallback={handleBack}*/}
            {/*    approveVoteCallback={handleApproveVote}*/}
            {/*    rejectVoteCallback={handleRejectVote}*/}
            {/*/>*/}
        </>
    )
}

const EnsConstitutionVoting = () => {
    const history = useHistory();
    const {currentStep, setCurrentStep, totalSteps} = useConstitutionSteps()
    const constitution = getConstitution()
    const article = constitution?.[currentStep]

    const handleBack = () => {
        console.log('handleBack: ', currentStep)
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
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
