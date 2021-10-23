import React from 'react';
import styled from 'styled-components';

import SectionHeader from "./SectionHeader";
import Footer from '../../components/Footer'
import {Content, Header} from '../../components/text'
import {ContentBox, ContentBoxWithHeader, NarrowColumn} from "../../components/layout";
import Gap from "../../components/Gap";
import Token from "../../components/Token";

const BlackBold = styled.b`
  color: black;
`

const ENSConstitutionSign = ({handleBack, handleNext, currentStep, setCurrentStep}) => {
    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Confirm with wallet</Header>
                <Gap height={3}/>
                <Content>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In semper orci in dolor laoreet hendrerit. Duis rutrum eu magna non gravida. Vestibulum pulvinar ante eu tortor malesuada consectetur.
                </Content>
                <Gap height={3}/>
                <Content>
                    We hope these rules form the basis for a strong community,
                    and recognize the participation of the contributors who have made ENS what it is today.
                </Content>
                <Gap height={3}/>
                <Content>
                    A minimum consensus of 75% of votes is required to
                    ratify a given Article of the Constitution.
                </Content>
                <Gap height={3}/>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={handleNext}
                leftButtonText="Back"
                leftButtonCallback={handleBack}
            />
        </NarrowColumn>
    );
};

export default ENSConstitutionSign;
