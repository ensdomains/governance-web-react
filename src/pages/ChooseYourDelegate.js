import React from 'react';
import { useHistory } from "react-router-dom";

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content, TokenText} from '../components/text'
import { NarrowColumn } from "../components/layout";
import { ContentBox } from "../components/layout";

const ChooseYourDelegate = () => {
    const history = useHistory();

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Choose a delegate</Header>
                <Gap height={3} />
                <Content>
                    Select a community member whose views you align with, who will be able to vote with the power of your tokens.
                </Content>
                <Gap height={5} />
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {history.push('/constitution')}}
                leftButtonText="Back"
                leftButtonCallback={() => {history.push('/governance')}}
            />
        </NarrowColumn>
    );
};

export default ChooseYourDelegate;
