import React, {useEffect, useState} from 'react';
import {gql} from "graphql-tag";
import {useQuery} from "@apollo/client";
import {Client} from "@snapshot-labs/snapshot.js";

import Footer from '../../components/Footer'
import {Content, Header} from '../../components/text'
import {ContentBox, NarrowColumn} from "../../components/layout";
import Gap from "../../components/Gap";
import {useHistory} from "react-router-dom";
import {getEthersProvider} from "../../web3modal";
import TransactionState from "../../components/TransactionState";


const handleVote = async (setVoteState, address, history) => {
    const snapshotClient = new Client()
    const ethersProvider = getEthersProvider()
    try {
        setVoteState({
            state: 'LOADING',
            message: ''
        })
        await snapshotClient.vote(
            ethersProvider,
            address,
            'bananana.eth',
            {proposal: 'QmT6ydSCeha4JWLsjuHmQ7y7Muo3uuvnu5rQ9AiHZpNMSf', choice: [1]}
        )
        setVoteState({
            state: 'SUCCESS',
            message: ''
        })
        setTimeout(() => {
            history.push('/delegates')
        }, 2000)
    } catch (error) {
        setVoteState({
            state: 'ERROR',
            message: error
        })
    }
}

const ENS_CONSTITUTION_SIGN_QUERY = gql`
  query privateRouteQuery @client {
    isConnected
    address
  }
`

const ENSConstitutionSign = ({location}) => {
    const {data} = useQuery(ENS_CONSTITUTION_SIGN_QUERY)
    const history = useHistory();
    const [voteState, setVoteState] = useState({
        state: 'LOADING',
        message: ''
    })

    useEffect(() => {
        if (location.state && data.isConnected) {
            handleVote(setVoteState, data.address, history)
        }
    }, [data.isConnected, data.address])

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Confirm with wallet</Header>
                <Gap height={3}/>
                <Content>
                    Please approve the signing request to submit your votes.
                </Content>
                <Gap height={6}/>
                <TransactionState
                    transactionState={voteState.state}
                    title={"Submit votes"}
                    content={"This message is signed off-chain, and does not cost any gas."}
                />
            </ContentBox>
            <Footer
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/constitution')
                }}
                rightButtonText={voteState.state === 'SUCCESS' ? "Continuing..." : "Try Again"}
                rightButtonCallback={() => {
                    if(voteState.state === 'SUCCESS') {
                        history.push('/delegates')
                        return
                    }
                    handleVote(setVoteState, data.address, history)
                }}
                disabled={voteState.state === 'LOADING' || voteState.state === 'SUCCESS' ? 'disabled' : ''}
            />
        </NarrowColumn>
    );
};

export default ENSConstitutionSign;
