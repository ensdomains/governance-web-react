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
import Token from "../components/Token";

const Container = styled.div`
    max-width: 920px;
    margin: 0 auto;
    
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;

    
    ${largerThan.tablet`
        grid-template-columns: minmax(0,1fr) minmax(0,0.9fr);
        grid-template-rows: repeat(3, auto);
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

const WhatIsENSContentBox = styled(ContentBox)`
  grid-row-start: 1;
  grid-row-end: 3;
`

const Why = () => {
    const history = useHistory();

    return (
        <Container>
            <WhatIsENSContentBox>
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
                            <StatsNumber>>310</StatsNumber>
                        </NumberWithLogoContainer>
                    </StatsRow>
                </StatsSection>
            </WhatIsENSContentBox>

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
            <ContentBox>
                <Header>Why launch it now?</Header>
                <Gap height={3}/>
                <Content>
                    Both ENS and the DAO space have matured in the last year. We believe now is the time for ENS to further decentralize protocol governance.
                </Content>
            </ContentBox>
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
