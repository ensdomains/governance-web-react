import React from 'react';
import styled from "styled-components";

import {ContentBoxWithHeader} from "../../components/layout";
import SectionHeader from "./SectionHeader";
import theme from "../../components/theme";
import Footer from "../../components/Footer";
import {useHistory} from "react-router-dom";

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

const ContentContainer = styled.div`
    display: grid;
    gap: 15px;
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
    const history = useHistory();

    return (
        <>
            <ContentBoxWithHeader
                HeaderComponent={<SectionHeader {...{currentStep, setCurrentStep}}/>}
            >
                <ContentContainer>
                    {constitution.map(SummaryArticle)}
                </ContentContainer>
            </ContentBoxWithHeader>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {history.push('/claim')}}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    setCurrentStep(currentStep-1)
                }}
            />
        </>
    )
}

export default Summary
