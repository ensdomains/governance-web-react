import React from 'react';
import styled from 'styled-components'

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
`

const BoxTitle = styled.div``

const BoxContent = styled.div``

const BoxContentContainer = styled.div`
`

const Box = ({x: {title, content}}) => {
    return (
        <BoxContainer>
            <BoxTitle>{title}</BoxTitle>
            <BoxContentContainer>
                {content.map(text => <BoxContent>{text}</BoxContent>)}
            </BoxContentContainer>
        </BoxContainer>
    )
}

const Container = styled.div`
    display: flex;
    
`

const Home = () => {
    return (
        <Container>
            {copy.map(x => <Box {...{ x }}/>)}
        </Container>
    );
};

export default Home;
