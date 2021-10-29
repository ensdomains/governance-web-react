import React from 'react';
import styled from 'styled-components/macro'
import {useHistory} from "react-router-dom";

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content} from '../components/text'
import {NarrowColumn} from "../components/layout";
import {ContentBox} from "../components/layout";

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
                    Half of the tokens will be allocated to the DAO community treasury which can be governed by the token holders. The other half of the tokens are split between contributors and a retroactive airdrop to users.
                </Content>
                <Gap height={3}/>
                <Content>
                    Any address that has ever owned an ENS name is eligible for the <b>retroactive airdrop</b>. Past and future registrations are counted, with future registrations capped at 8 years. Accounts with their <b>Primary ENS Name</b> record set will receive a 2x multiplier.
                </Content>
                <Gap height={3}/>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/constitution')
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
