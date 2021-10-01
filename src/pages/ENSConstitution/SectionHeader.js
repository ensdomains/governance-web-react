import styled from "styled-components";
import {Header} from "../../components/text";

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
    background: #DDDDDD;
    
    &:not(:last-child) {
        margin-right: 10px;
    }
`

const SectionHeader = ({totalSteps}) => {
    return (
        <SectionHeaderContainer>
            <Header>Constitution</Header>
            <StepsContainer>
                {/*{steps.map(step => {*/}
                {/*    return (*/}
                {/*        <Step/>*/}
                {/*    )*/}
                {/*})}*/}
            </StepsContainer>
        </SectionHeaderContainer>
    )
}

export default SectionHeader
