import React from 'react';
import styled from 'styled-components'
import {useHistory} from "react-router-dom";

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content, TokenText, SubsubTitle, Statistic} from '../components/text'
import {InnerContentBox, NarrowColumn} from "../components/layout";
import {ContentBox} from "../components/layout";
import {largerThan} from "../utils/styledComponents";

const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;

    
    ${largerThan.tablet`
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(3, auto);
    `}
`

const Row = styled.div`
    display: flex;
`

const StatsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    
    ${largerThan.sMobile`
        flex-direction: row;    
    `}
`

const WrappedInnerContentBox = styled(InnerContentBox)`
    &:first-child {
            margin-bottom: 20px;
        }

    ${largerThan.sMobile`
        &:first-child {
            margin-right: 10px;
            margin-bottom: 0px;
        }
        
        &:last-child {
            margin-left: 10px;
        }
    `}
`

const FullWidthBox = styled(ContentBox)`
${largerThan.tablet`
    grid-column-start: 1;
    grid-column-end: 3;    
    `}
`


const Why = () => {
    const history = useHistory();

    return (
        <Container>
            <ContentBox>
                <Header>Why launch a token?</Header>
                <Gap height={3}/>
                <Content>
                    ENS is launching <TokenText>$ENS</TokenText> to continue the journey of decentralization, and to
                    make the protocol unstoppable.
                    It represents the first step in a handover of control from the core contributing group, to the wider
                    community.
                </Content>
                <Gap height={5}/>
                <Content>
                    <TokenText>$ENS</TokenText> will empower community members to have a say in the direction of the
                    protocol, its revenue, a community treasury, and technical parameters moving forward.
                </Content>
            </ContentBox>
            <ContentBox>
                <Header>The story so far...</Header>
                <Gap height={3}/>
                <Content>
                    The Ethereum Name Service was created to build a
                    human-readable name system for Ethereum, with the goal
                    of becoming widely adopted. Since then, the protocol has
                    seen tremendous growth in usage.
                </Content>
                <Gap height={5}/>
                <StatsContainer>
                    <WrappedInnerContentBox>
                        <SubsubTitle>Names created</SubsubTitle>
                        <Gap height={2}/>
                        <Statistic>3,405,411</Statistic>
                    </WrappedInnerContentBox>
                    <WrappedInnerContentBox>
                        <SubsubTitle>Years registered</SubsubTitle>
                        <Gap height={2}/>
                        <Statistic>4,500.41</Statistic>
                    </WrappedInnerContentBox>
                </StatsContainer>
            </ContentBox>
            <FullWidthBox>
                <Header>Why launch it now?</Header>
                <Gap height={3}/>
                <Content>
                    Over the past 12 months, ENS has seen <b>massive growth</b> in both the registration and usage of
                    ENS names. We firmly believe that now is the time for the protocol to start to become entirely
                    self-sufficient and community owned.
                </Content>
            </FullWidthBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/governance')
                }}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/claim')
                }}
            />
        </Container>
    );
};

export default Why;
