import React from 'react';
import {Client} from '@snapshot-labs/snapshot.js'
import {hexlify} from '@ethersproject/bytes';

import SectionHeader from "./SectionHeader";
import Footer from '../../components/Footer'
import {Content, Header} from '../../components/text'
import {ContentBox, ContentBoxWithHeader, NarrowColumn} from "../../components/layout";
import Gap from "../../components/Gap";


export async function signMessage(web3, msg, address) {
    msg = hexlify(new Buffer(msg, 'utf8'));
    return await web3.send('personal_sign', [msg, address]);
}

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
                    claimable ENS. Voting is optional, are conducted off-chain using Snapshot.
                </Content>
                <Gap height={3}/>
                <Content>
                    We hope these rules form the basis for a strong community,
                    and recognize the participation of the contributors who have made ENS what it is today.
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
