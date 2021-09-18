import React from 'react';
import styled from 'styled-components/macro'
import { useHistory } from "react-router-dom";

import { largerThan} from "./utils/styledComponents";
import Footer from './components/Footer'
import Gap from './components/Gap'
import {Header, Content, SubsubTitle, Statistic} from './components/text'
import { NarrowColumn } from "./components/layout";
import { ContentBox, InnerContentBox} from "./components/layout";

const copy = [
    {
        title: 'Story so far',
        content: [
            'The ethereum name service was launched in 2017',
            'Since launch, over 1 million names have been registered',
            'Over 1 billion years of ens names have been purchased'
        ]
    },
    {
        title: 'Why token?',
        content: [
            'ENS is launching the token in order to continue',
            '$ENS represents the first step in handing over control',
            'ENS will empower community memebers'
        ]
    },
    {
        title: 'Why now?',
        content: [
            'Over the past 12 months ENS has seen massive growth',
            'We firmly belive now is the time',
        ]
    },
]

const BoxContainer = styled.div`
      background: lightgreen;
      width: 300px;
      height: 300px;
      padding: 20px;
      box-sizing: border-box;
      margin: 20px 10px;
`

const BoxTitle = styled.div`
    font-size: 48px;
    text-align: center;
`

const BoxContent = styled.div``

const BoxContentContainer = styled.div`
`

const Box = ({x: {title, content}}) => {
    return (
        <BoxContainer>
            <BoxTitle>{title}</BoxTitle>
            <Gap height={6} />
            <BoxContentContainer>
                {content.map(text =>
                    <>
                        <BoxContent>{text}</BoxContent>
                        <Gap height={4} />
                     </>
                )}
            </BoxContentContainer>
        </BoxContainer>
    )
}

const StatsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

const JoinENS = () => {
    const history = useHistory();

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>The story so far...</Header>
                <Gap height={3} />
                <Content>
                    The Ethereum Name Service was created to build a
                    human-readable name system for Ethereum, with the goal
                    of becoming widely adopted. Since then, the protocol has
                    seen tremendous growth in usage.
                </Content>
                <Gap height={5} />
                <StatsContainer>
                    <InnerContentBox>
                        <SubsubTitle>Names created</SubsubTitle>
                        <Gap height={2} />
                        <Statistic>3,405,411</Statistic>
                    </InnerContentBox>
                    <InnerContentBox>
                        <SubsubTitle>Years registered</SubsubTitle>
                        <Gap height={2} />
                        <Statistic>4,500.41</Statistic>
                    </InnerContentBox>
                </StatsContainer>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {history.push('/governance')}}
            />
        </NarrowColumn>
    );
};

export default JoinENS;
