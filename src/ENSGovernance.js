import React from 'react';
import styled from 'styled-components/macro'
import { useHistory } from "react-router-dom";

import Footer from './components/Footer'
import Gap from './components/Gap'
import {largerThan} from "./utils/styledComponents";

const copy = [
    {
        src: 'https://place-hold.it/150/150',
        content: [
            'The ethereum name service was launched in 2017',
            'Since launch, over 1 million names have been registered',
            'Over 1 billion years of ens names have been purchased'
        ]
    },
    {
        src: 'https://place-hold.it/150/150',
        content: [
            'ENS is launching the token in order to continue',
            '$ENS represents the first step in handing over control',
            'ENS will empower community memebers'
        ]
    },
    {
        src: 'https://place-hold.it/150/150',
        content: [
            'Over the past 12 months ENS has seen massive growth',
            'We firmly belive now is the time',
        ]
    },
    {
        src: 'https://place-hold.it/150/150',
        content: [
            'Over the past 12 months ENS has seen massive growth',
            'We firmly belive now is the time',
        ]
    },
]

const BoxContainer = styled.div`
      width: 250px;
      height: 400px;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      margin: 20px 10px;
`

const BoxTitle = styled.div`
    font-size: 48px;
    text-align: center;
`

const BoxContent = styled.div``

const BoxContentContainer = styled.div`
`

const BoxImg = styled.img`
    margin: 0 auto;
`

const Box = ({x: {src, content}}) => {
    return (
        <BoxContainer>
            <BoxImg src={src}/>
            <Gap height={12} />
            <BoxContentContainer>
                <ul>
                    {content.map(text =>
                        <>
                            <li>{text}</li>
                            <Gap height={4} />
                        </>
                    )}
                </ul>
            </BoxContentContainer>
        </BoxContainer>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    background: lightgreen;
`

const ENSGovernance = () => {
    const history = useHistory();

    return (
        <>
            <Container>
                {copy.map(x => <Box {...{ x }}/>)}
            </Container>
            <Footer
                rightButtonText="Get Started"
                rightButtonCallback={() => {history.push('/distribution')}}
            />
        </>
    );
};

export default ENSGovernance;
