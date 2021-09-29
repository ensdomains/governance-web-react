import React, {useEffect} from 'react';
import styled from 'styled-components/macro'
import {useHistory} from "react-router-dom";
import {Client} from '@snapshot-labs/snapshot.js'

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content} from '../components/text'
import {NarrowColumn} from "../components/layout";
import {ContentBox} from "../components/layout";
import {getEthersProvider} from "../web3modal";
import {useQuery} from "@apollo/client";
import {gql} from "graphql-tag";

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
            <Gap height={6}/>
            <BoxContentContainer>
                {content.map(text =>
                    <>
                        <BoxContent>{text}</BoxContent>
                        <Gap height={4}/>
                    </>
                )}
            </BoxContentContainer>
        </BoxContainer>
    )
}


const ENSConstitution = () => {
    const history = useHistory();

    const {data: {isConnected, address}} = useQuery(gql`
        query getHeaderData @client {
            address
            isConnected
        }
    `)

    useEffect(() => {
        if (address) {
            const snapshotClient = new Client()
            const ethersProvider = getEthersProvider()
            // snapshotClient.vote(
            //     ethersProvider,
            //     address,
            //     'bananana.eth',
            //     {proposal: 'QmSEspbHEcD5o2MGNwjr4mj218CRwAimt1eXjLNcLP2CN6', choice: [1, 2, 3]}
            // )
        }
    }, [address])

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Constitution</Header>
                <Gap height={3}/>
                <Content>
                    Over the past 12 months, ENS has seen <b>massive growth</b> in both the registration and usage of
                    ENS names. We firmly believe that now is the time for the protocol to start to become entirely
                    self-sufficient and community owned.
                </Content>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/delegates')
                }}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/governance')
                }}
            />
        </NarrowColumn>
    );
};

export default ENSConstitution;
