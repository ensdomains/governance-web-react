import React from 'react';
import styled from 'styled-components/macro'
import { useHistory } from "react-router-dom";

import { largerThan} from "./utils/styledComponents";
import Footer from './components/Footer'
import Gap from './components/Gap'

const copy = [
    {
        title: 'Story so far',
        content: [
            'The ethereum name service was launched in 2017',
            'Since launch, over 1 million names have been registered',
            'Over 1 billion years of ens names have been purchased'
        ]
    },
    {
        title: 'Why token?',
        content: [
            'ENS is launching the token in order to continue',
            '$ENS represents the first step in handing over control',
            'ENS will empower community memebers'
        ]
    },
    {
        title: 'Why now?',
        content: [
            'Over the past 12 months ENS has seen massive growth',
            'We firmly belive now is the time',
        ]
    },
]

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

const Container = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    
    ${largerThan.sMobile`
    `}
`

const JoinENS = () => {
    const history = useHistory();

    return (
        <>
        <Container>
            {copy.map(x => <Box {...{ x }}/>)}
        </Container>
            <Footer
                rightButtonText="Get Started"
                rightButtonCallback={() => {history.push('/governance')}}
            />
        </>
    );
};

export default JoinENS;
