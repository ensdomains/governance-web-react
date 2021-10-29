import React from 'react';
import styled from 'styled-components'
import {useHistory} from "react-router-dom";

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content, TokenText, SubsubTitle, Statistic} from '../components/text'
import {InnerContentBox, NarrowColumn} from "../components/layout";
import {ContentBox} from "../components/layout";
import {largerThan} from "../utils/styledComponents";
import Divider from "../components/Divider";
import SplashENSLogo from "../assets/imgs/SplashENSLogo.svg";
import Token from "../components/Token";

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

const RowLabel = styled.div`
  letter-spacing: -0.01em;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #717171;
  display: flex;
  align-items: center;
`

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
`

const StatsSection = styled.div`
`

const StatsNumber = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  color: #000000;
`

const NumberWithLogoContainer = styled.div`
  display: flex;
  align-items: center;
`

const StatsSubtitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.01em;
  color: #717171;
  opacity: 0.6;
`

const Why = () => {
    const history = useHistory();

    return (
        <Container>
            <ContentBox>
                <Header>What is ENS?</Header>
                <Gap height={3}/>
                <Content>
                    Your ENS name is your web3 username and profile, one name for all of your crypto addresses, and your decentralized website.
                </Content>
                <Gap height={5}/>
                <StatsSection>
                    <StatsRow>
                        <RowLabel>Names</RowLabel>
                        <NumberWithLogoContainer>
                            <StatsNumber>>400k</StatsNumber>
                        </NumberWithLogoContainer>
                    </StatsRow>
                    <Divider/>
                    <StatsRow>
                        <RowLabel>Years registered</RowLabel>
                        <NumberWithLogoContainer>
                            <StatsNumber>>1,775,000</StatsNumber>
                        </NumberWithLogoContainer>
                    </StatsRow>
                    <Divider/>
                    <StatsRow>
                        <RowLabel>Integrations</RowLabel>
                        <NumberWithLogoContainer>
                            <StatsNumber>311</StatsNumber>
                        </NumberWithLogoContainer>
                    </StatsRow>
                </StatsSection>
            </ContentBox>

            <ContentBox>
                <Header>Why launch a token?</Header>
                <Gap height={3}/>
                <Content>
                    <Token /> is an important step in  further decentralizing governance of the ENS protocol.
                </Content>
                <Gap height={5}/>
                <Content>
                    It will empower community members to direct its development, community treasury, and technical parameters.
                </Content>
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
            <Footer grid
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
