import React from 'react';
import {Client, utils} from '@snapshot-labs/snapshot.js'
import {hexlify} from '@ethersproject/bytes';

import {ContentBox, NarrowColumn} from "../components/layout";
import {Header} from "../components/text";
import Gap from "../components/Gap";
import {getEthersProvider} from "../web3modal";
import {BigNumber, Contract} from "ethers";
import {generateMerkleShardUrl, getENSTokenContractAddress} from "../utils/utils";
import ENSTokenAbi from "../assets/abis/ENSToken.json";
import merkleRoot from "../assets/root.json";
import ShardedMerkleTree from "../merkle";
import {CTAButton} from "../components/buttons";
import {useQuery} from "@apollo/client";
import {gql} from "graphql-tag";

export async function signMessage(web3, msg, address) {
    msg = hexlify(new Buffer(msg, 'utf8'));
    return await web3.send('personal_sign', [msg, address]);
}

const submitClaim = async (balance, proof, address) => {
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
    } catch (e) {
        console.error(e)
    }
}

const handleClaim = (address) => async () => {
    try {
        const response = await fetch(generateMerkleShardUrl(address))
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
        // submitClaim("0003391299489722269696", proof, address)
        submitClaim(entry.balance, proof, address)
    } catch (e) {
        console.error(e)
    }
}

const handleVote = async () => {
    const snapshotClient = new Client()
    const ethersProvider = getEthersProvider()
    snapshotClient.vote(
        ethersProvider,
        '0xBe8563B89d31AD287c73da42848Bd7646172E0ba',
        'bananana.eth',
        {proposal: 'QmerF9zBj9QNk3evSTigCdmfQ1SdS2MN4yfCkyHZCd8tcy', choice: [1]}
    )

    // const scores = await utils.getScores(
    //     'bananana.eth',
    //     ['api'],
    //     'Ethereum mainnet',
    //     ethersProvider,
    //     ['0xBe8563B89d31AD287c73da42848Bd7646172E0ba'],
    // );

    // console.log('scores: ', scores)

    //const result = await fetch('https://us-central1-ens-manager.cloudfunctions.net/getvotes?addresses=0x0904dac3347ea47d208f3fd67402d039a3b99859')
    //console.log('result: ', result)
}

const EnsSummary = () => {
    const {data: {address}} = useQuery(gql`
      query privateRouteQuery @client {
        address
      }
    `)
    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Submit your claim</Header>
                <Gap height={3}/>
                <CTAButton onClick={handleVote} text={"Vote"} /><br />
                <CTAButton onClick={handleClaim(address)} text={"Claim"}/>
                <Gap height={3}/>
            </ContentBox>
        </NarrowColumn>
    );
};

export default EnsSummary;
