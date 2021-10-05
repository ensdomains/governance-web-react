import styled from "styled-components";
import {Header} from "../../components/text";
import {getConstitution} from "./constitutionHelpers";
import theme from "../../components/theme";

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
    background: ${p => {
        if(p.currentStep) return `#878787`
        if(p.vote === true) return theme.colors.green
        if(p.vote === false) return theme.colors.red
        return `#DDDDDD`
    }};
    
    &:not(:last-child) {
        margin-right: 10px;
    }
    
`

const SectionHeader = ({totalSteps, currentStep}) => {
    const constitution = getConstitution()
    const article = constitution[currentStep]

    return (
        <SectionHeaderContainer>
            <Header>Constitution</Header>
            <StepsContainer>
                {constitution.map((article, idx) => {
                    return (
                        <Step
                            currentStep={currentStep === idx}
                            vote={article.vote}
                        />
                    )
                })}
            </StepsContainer>
        </SectionHeaderContainer>
    )
}

export default SectionHeader
