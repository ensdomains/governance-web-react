import React from 'react';
import styled from 'styled-components';

import SectionHeader from "./SectionHeader";
import Footer from '../../components/Footer'
import {Content, Header} from '../../components/text'
import {ContentBoxWithHeader, NarrowColumn} from "../../components/layout";
import Gap from "../../components/Gap";
import Token from "../../components/Token";

const BlackBold = styled.b`
  color: black;
`

const ENSConstitutionInfo = ({handleBack, handleNext, currentStep, setCurrentStep}) => {
    return (
        <NarrowColumn>
            <ContentBoxWithHeader
                HeaderComponent={<SectionHeader {...{currentStep, setCurrentStep}}/>}
            >
                <Header>Help shape the community</Header>
                <Gap height={3}/>
                <Content>
                    We have created an initial set of community guidelines for which you may vote for or against with your allocation of
                    claimable <Token />. Voting is optional, are conducted off-chain using <BlackBold>Snapshot</BlackBold>.
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
            </ContentBoxWithHeader>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={handleNext}
                leftButtonText="Back"
                leftButtonCallback={handleBack}
            />
        </NarrowColumn>
    );
};

export default ENSConstitutionInfo;
