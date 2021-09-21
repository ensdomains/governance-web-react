import React, {useEffect, useState} from 'react';
import {useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import {formatTokenAmount} from "../utils/utils";

const getFirstNameRegistration = () => {

}

const getTotalTimeRegistered = () => {

}

const getNumberOfNamesRegistered = () => {

}

const getLastNameExpiry = () => {

}

const generateMerkleShardUrl = (address) => {
    return `/airdrops/mainnet/${address?.slice(2, 4)}.json`
}

const useGetAddressDetails = (address) => {
    const [addressDetails, setAddressDetails] = useState(null)

    useEffect(() => {
        const run = async () => {
            const response = await fetch(generateMerkleShardUrl(address))
            if (!response.ok) {
                console.error('error getting shard data')
            }
            const shardData = await response.json()
            setAddressDetails(shardData?.entries[address])
        }

        if (address) {
            try {
                run()
            } catch (e) {
                console.error(e)
            }
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

const useClaimData = () => {
    const {data: {address}} = useQuery(gql`
        query getHeaderData @client {
            address
        }
    `)

    const addressDetails = useGetAddressDetails(address)

    const { data } = useQuery(
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

    console.log('addressDetails: ', addressDetails)

    return ({
        lastExpiringName,
        longestOwnedName,
        pastTokens,
        futureTokens,
        balance
    })
}

const ClaimEnsToken = () => {
    const { lastExpiringName, longestOwnedName, pastTokens, futureTokens, balance } = useClaimData()
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
        </div>
    );
};

export default ClaimEnsToken;
