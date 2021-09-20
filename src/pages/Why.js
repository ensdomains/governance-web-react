import React from 'react';
import { useHistory } from "react-router-dom";

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content, TokenText} from '../components/text'
import { NarrowColumn } from "../components/layout";
import { ContentBox } from "../components/layout";

const Why = () => {
    const history = useHistory();

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Why launch a token?</Header>
                <Gap height={3} />
                <Content>
                    ENS is launching <TokenText>$ENS</TokenText> to continue the journey of decentralization, and to make the protocol unstoppable.
                    It represents the first step in a handover of control from the core contributing group, to the wider community.
                </Content>
                <Gap height={5} />
                <Content>
                    <TokenText>$ENS</TokenText> will empower community members to have a say in the direction of the protocol, its revenue, a community treasury, and technical parameters moving forward.
                </Content>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {history.push('/whynow')}}
                leftButtonText="Back"
                leftButtonCallback={() => {history.push('/join')}}
            />
        </NarrowColumn>
    );
};

export default Why;
