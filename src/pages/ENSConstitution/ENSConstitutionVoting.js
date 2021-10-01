import React, {useState, useCallback, useEffect} from 'react';
import {getEarliestUnvotedArticle, getTotalNumberOfArticles} from "./constitutionHelpers";
import {ContentBoxWithHeader, NarrowColumn} from "../../components/layout";
import SectionHeader from "./SectionHeader";
import {Content} from "../../components/text";
import Footer from "../../components/Footer";
import {useHistory} from "react-router-dom";

const useSteps = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const totalSteps = useCallback(() => getTotalNumberOfArticles(), [])

    useEffect(() => {
        setCurrentStep(getEarliestUnvotedArticle())
    }, [])

    return ({currentStep, setCurrentStep, totalSteps})
}

const EnsConstitutionVoting = () => {
    const history = useHistory();
    const {currentStep, setCurrentStep, totalSteps} = useSteps()
    console.log('curr')

    return (
        <NarrowColumn>
            <ContentBoxWithHeader
                HeaderComponent={<SectionHeader {...{currentStep, setCurrentStep, totalSteps}}/>}
            >
                <Content>
                    Over the past 12 months, ENS has seen <b>massive growth</b> in both the registration and usage of
                    ENS names. We firmly believe that now is the time for the protocol to start to become entirely
                    self-sufficient and community owned.
                </Content>
            </ContentBoxWithHeader>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/constitution/vote')
                }}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/governance')
                }}
            />
        </NarrowColumn>
    );
};

export default EnsConstitutionVoting;
