import styled from "styled-components";
import {Header} from "../../components/text";
import {getConstitution} from "./constitutionHelpers";

const SectionHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;   
`

const StepsContainer = styled.div`
    display: flex;
`

const Step = styled.div`
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background: ${p => p.currentStep ? `#878787` : `#DDDDDD`};
    
    &:not(:last-child) {
        margin-right: 10px;
    }
    
`

const SectionHeader = ({totalSteps, currentStep}) => {
    const constitution = getConstitution()
    console.log('constitution: ', constitution)
    return (
        <SectionHeaderContainer>
            <Header>Constitution</Header>
            <StepsContainer>
                {constitution.map((article, idx) => {
                    return (
                        <Step currentStep={currentStep === idx} />
                    )
                })}
            </StepsContainer>
        </SectionHeaderContainer>
    )
}

export default SectionHeader
