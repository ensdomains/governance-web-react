import React, {useEffect, useState} from 'react';
import {useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import {formatTokenAmount, getENSTokenContractAddress, isDev} from "../utils/utils";
import Footer from "../components/Footer";
import {Contract, BigNumber} from "ethers";

import ENSTokenAbi from '../assets/abis/ENSToken'
import {getEthersProvider, getJsonRpcProvider} from "../web3modal";
import ShardedMerkleTree from "../merkle";

import merkleRoot from '../assets/root'

const generateMerkleShardUrl = (address) => `/airdrops/mainnet/${address?.slice(2, 4)}.json`


const useGetAddressDetails = (address) => {
    const [addressDetails, setAddressDetails] = useState(null)

    useEffect(() => {
        const run = async () => {
            const response = await fetch(generateMerkleShardUrl(address))
            if (!response.ok) {
                throw new Error('error getting shard data')
            }
            const shardData = await response.json({encoding: 'utf-8'})
            setAddressDetails(shardData?.entries[address])
        }

        if (address) {
            run().catch(e => console.error(e))
        }
    }, [address])

    return addressDetails
}

const LABELHASH_QUERY = gql`
query domainByLabelhash($labelhash: [String]) {
    domains(where:{ labelhash_in: $labelhash }) {
        name
        labelhash
      }
}
`

const useClaimData = (address) => {
    const addressDetails = useGetAddressDetails(address)

    const {data} = useQuery(
        LABELHASH_QUERY,
        {
            variables: {
                labelhash: [addressDetails?.last_expiring_name, addressDetails?.longest_owned_name]
            }
        }
    )

    const longestOwnedName = data
        ?.domains
        .find(x => x.labelhash === addressDetails?.longest_owned_name)
        ?.name
    const lastExpiringName = data
        ?.domains.find(x => x.labelhash === addressDetails?.last_expiring_name)
        ?.name
    const pastTokens = formatTokenAmount(addressDetails?.past_tokens)
    const futureTokens = formatTokenAmount(addressDetails?.future_tokens)
    const balance = formatTokenAmount(addressDetails?.balance)

    return ({
        lastExpiringName,
        longestOwnedName,
        pastTokens,
        futureTokens,
        balance,
        rawBalance: addressDetails?.balance
    })
}

const submitClaim = async (balance, proof, address) => {
    try{
        const provider = getEthersProvider()
        const signer = provider.getSigner()
        const ENSTokenContract = new Contract(getENSTokenContractAddress(), ENSTokenAbi.abi, signer);
        ENSTokenContract.connect(signer)
        const result = await ENSTokenContract.claimTokens(
            balance,
            address,
            proof
        )
        console.log('result: ', result)
    } catch (e) {
        console.log(e)
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
        submitClaim(entry.balance, proof, address)
    } catch (e) {
        console.error(e)
    }
}

const ClaimEnsToken = () => {
    const {data: {address}} = useQuery(gql`
        query getHeaderData @client {
            address
        }
    `)
    const {
        lastExpiringName,
        longestOwnedName,
        pastTokens,
        futureTokens,
        balance,
        rawBalance
    } = useClaimData(address)
    return (
        <div>
            <div>
                Claim
            </div>
            <div>
                <span>Last expiring name: </span><span>{lastExpiringName}</span>
            </div>
            <div>
                <span>Longest owned name: </span><span>{longestOwnedName}</span>
            </div>
            <div>
                <span>Past tokens: </span><span>{pastTokens}</span>
            </div>
            <div>
                <span>Future tokens: </span><span>{futureTokens}</span>
            </div>
            <div>
                <span>Balance: </span><span>{balance}</span>
            </div>
            <Footer
                rightButtonText="Claim your tokens"
                rightButtonCallback={handleClaim(address, rawBalance)}
                leftButtonText="Choose your delegate"
            />
        </div>
    );
};

export default ClaimEnsToken;
