import React from 'react';
import styled from 'styled-components/macro'
import { useHistory } from "react-router-dom";

import { largerThan} from "../utils/styledComponents";
import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content, SubsubTitle, Statistic} from '../components/text'
import { NarrowColumn } from "../components/layout";
import { ContentBox, InnerContentBox} from "../components/layout";

import ShareExplainer from "../assets/imgs/ShareExplainer.svg";
import AirdropExplainer from "../assets/imgs/AirdropExplainer.svg";

const Img = styled.img`
    width: 100%;
`

const ENSGovernance = () => {
    const history = useHistory();

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>How is it distributed?</Header>
                <Gap height={3} />
                <Content>
                    Over half of the tokens will be allocated to a community treasury which can be governed by the token holders. The other half of the tokens are split between the contributors, and a retroactive airdrop to reward early users.
                </Content>
                <Gap height={5} />
                <Img src={ShareExplainer} />
                <Gap height={5} />
                <Content>
                    Over half of the tokens will be allocated to a community treasury which can be governed by the token holders. The other half of the tokens are split between the contributors, and a retroactive airdrop to reward early users.
                </Content>
                <Gap height={5} />
                <Img src={AirdropExplainer} />
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {history.push('/constitution')}}
                leftButtonText="Back"
                leftButtonCallback={() => {history.push('/whynow')}}
            />
        </NarrowColumn>
    );
};

export default ENSGovernance;
