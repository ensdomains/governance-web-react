import React from 'react';
import styled from 'styled-components/macro'
import {useHistory} from "react-router-dom";

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content, SubsubTitle, Statistic} from '../components/text'
import {NarrowColumn} from "../components/layout";
import {ContentBox, InnerContentBox} from "../components/layout";

import DistPng from '../assets/imgs/Distribution.png'

const Img = styled.img`
    width: 100%;
    margin-top: -15px;
`

const WrappedNarrowColumn = styled(NarrowColumn)`
    max-width: 670px;
`

const ENSGovernance = () => {
    const history = useHistory();

    return (
        <WrappedNarrowColumn>
            <ContentBox>
                <Img src={DistPng}/>
                <Gap height={5}/>
                <Header>How is it distributed?</Header>
                <Gap height={3}/>
                <Content>
                    Over half of the tokens will be allocated to a community treasury which can be governed by the token
                    holders. The other half of the tokens are split between the contributors, and a retroactive airdrop
                    to reward early users.
                </Content>
                <Gap height={3}/>
                <Content>
                    Over half of the tokens will be allocated to a community treasury which can be governed by the token
                    holders. The other half of the tokens are split between the contributors, and a retroactive airdrop
                    to reward early users.
                </Content>
                <Gap height={3}/>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/delegates')
                }}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/why')
                }}
            />
        </WrappedNarrowColumn>
    );
};

export default ENSGovernance;
