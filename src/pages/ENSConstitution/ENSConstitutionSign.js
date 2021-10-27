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
import {CTAButton} from "../../components/buttons";
import TransactionState from "../../components/TransactionState";


const handleVote = async (setVoteState, address) => {
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
            {proposal: 'QmXPFfC9y78CDv44CQLQe37aj5h6455AaSdxcdiUaCBoiU', choice: [1]}
        )
        setVoteState({
            state: 'SUCCESS',
            message: ''
        })
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
            handleVote(setVoteState, data.address)
        }
    }, [data.isConnected])

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Confirm with wallet</Header>
                <Gap height={3}/>
                <Content>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In semper orci in dolor laoreet hendrerit.
                    Duis rutrum eu magna non gravida. Vestibulum pulvinar ante eu tortor malesuada consectetur.
                </Content>
                <Gap height={6}/>
                <TransactionState
                    transactionState={voteState.state}
                    title={"Submit votes"}
                    content={"This message is signed off-chain, and does not cost any gas"}
                />
                <Gap height={6}/>
                <CTAButton
                    onClick={() => {
                        if(voteState.state === 'SUCCESS') {
                            history.push('/summary')
                            return
                        }
                        handleVote(setVoteState, data.address)
                    }}
                    text={voteState.state === 'SUCCESS' ? 'Continue' : 'Try Again'}
                    type={voteState.state === 'LOADING' ? 'disabled' : ''}
                />
            </ContentBox>
            <Footer
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/constitution')
                }}
            />
        </NarrowColumn>
    );
};

export default ENSConstitutionSign;
