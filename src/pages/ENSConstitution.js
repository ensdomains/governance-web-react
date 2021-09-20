import React from 'react';
import styled from 'styled-components/macro'
import { useHistory } from "react-router-dom";

import { largerThan} from "../utils/styledComponents";
import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content } from '../components/text'
import { NarrowColumn } from "../components/layout";
import { ContentBox, InnerContentBox} from "../components/layout";

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


const WhyNow = () => {
    const history = useHistory();

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Constitution</Header>
                <Gap height={3} />
                <Content>
                    Over the past 12 months, ENS has seen <b>massive growth</b> in both the registration and usage of ENS names. We firmly believe that now is the time for the protocol to start to become entirely self-sufficient and community owned.
                </Content>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {history.push('/delegates')}}
                leftButtonText="Back"
                leftButtonCallback={() => {history.push('/governance')}}
            />
        </NarrowColumn>
    );
};

export default WhyNow;
