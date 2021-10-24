import React, {useEffect, useState} from 'react';
import {gql} from "graphql-tag";
import {useQuery} from "@apollo/client";
import {Client} from "@snapshot-labs/snapshot.js";
import {BigNumber, Contract} from "ethers";

import Footer from '../components/Footer'
import {Content, Header} from '../components/text'
import {ContentBox, NarrowColumn} from "../components/layout";
import Gap from "../components/Gap";
import {useHistory} from "react-router-dom";
import {getEthersProvider} from "../web3modal";
import {CTAButton} from "../components/buttons";
import TransactionState from "../components/TransactionState";
import {generateMerkleShardUrl, getENSTokenContractAddress} from "../utils/utils";
import ENSTokenAbi from "../assets/abis/ENSToken.json";
import merkleRoot from "../assets/root.json";
import ShardedMerkleTree from "../merkle";
import Pill from "../components/Pill";
import {getDelegateChoice} from "./ENSConstitution/delegateHelpers";

const submitClaim = async (balance, proof, address, setClaimState) => {
    try {
        const provider = getEthersProvider()
        const signer = provider.getSigner()
        const ENSTokenContract = new Contract(getENSTokenContractAddress(), ENSTokenAbi.abi, signer);
        ENSTokenContract.connect(signer)
        const result = await ENSTokenContract.claimTokens(
            balance,
            address,
            proof
        )
        const transactionReceipt = await result.wait(1)
        console.log('transaction receipt: ', transactionReceipt)
        setClaimState({
            state: 'SUCCESS',
            message: ''
        })
    } catch (error) {
        console.error(error)
        setClaimState({
            state: 'ERROR',
            message: error
        })
    }
}

const handleClaim = async (address, setClaimState) => {
    try {
        setClaimState({
            state: 'LOADING',
            message: ''
        })

        let delegateAddress
        let provider = getEthersProvider()

        const response = await fetch(generateMerkleShardUrl(address))

        const displayName = getDelegateChoice()
        if(!displayName) {
            throw 'No chosen delegate'
        }

        if(displayName.includes('.eth')) {
            delegateAddress = await provider.resolveName(displayName);
        } else {
            delegateAddress = displayName
        }

        if (!response.ok) {
            throw new Error('error getting shard data')
        }

        const shardJson = await response.json({encoding: 'utf-8'})
        const {root, shardNybbles, total} = merkleRoot;
        const shardedMerkleTree = new ShardedMerkleTree(
            () => shardJson,
            shardNybbles,
            root,
            BigNumber.from(total)
        )
        const [entry, proof] = shardedMerkleTree.getProof(address)
        await submitClaim(entry.balance, proof, delegateAddress, setClaimState)

    } catch (error) {
        console.error(error)
        setClaimState({
            state: 'ERROR',
            message: error
        })
    }
}


const ENSTokenClaim = ({location}) => {
    const {data: {isConnected, address}} = useQuery(gql`
      query privateRouteQuery @client {
        isConnected
        address
      }
    `)
    const history = useHistory();
    const [claimState, setClaimState] = useState({
        state: 'LOADING',
        message: ''
    })

    useEffect(() => {
        if (location.state && isConnected) {
            handleClaim(address, setClaimState)
        }
    }, [isConnected])

    return (
        <NarrowColumn>
            {(claimState.state === 'ERROR') && <Pill error text={claimState.message.message} />}
            <ContentBox>
                <Header>Confirm with wallet</Header>
                <Gap height={3}/>
                <Content>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In semper orci in dolor laoreet hendrerit.
                    Duis rutrum eu magna non gravida. Vestibulum pulvinar ante eu tortor malesuada consectetur.
                </Content>
                <Gap height={6}/>
                <TransactionState
                    transactionState={claimState.state}
                    title={"Delegate & claim tokens"}
                    content={"This transaction happens on-chain, and will require paying gas"}
                />
                <Gap height={6}/>
                <CTAButton
                    onClick={() => {
                        if (claimState.state === 'SUCCESS') {
                            history.push('/success')
                            return
                        }
                        handleClaim(address, setClaimState)
                    }}
                    text={claimState.state === 'SUCCESS' ? 'Continue' : 'Try Again'}
                    type={claimState.state === 'LOADING' ? 'disabled' : ''}
                />
            </ContentBox>
            <Footer
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/summary')
                }}
            />
        </NarrowColumn>
    );
};

export default ENSTokenClaim;
