import React, {useEffect, useState} from 'react';
import {useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import styled from 'styled-components';

import {formatTokenAmount, getENSTokenContractAddress} from "../utils/utils";
import Footer from "../components/Footer";
import {Contract, BigNumber} from "ethers";
import ENSTokenAbi from '../assets/abis/ENSToken'
import {getEthersProvider} from "../web3modal";
import ShardedMerkleTree from "../merkle";

import merkleRoot from '../assets/root'
import {ContentBox, InnerContentBox, NarrowColumn} from "../components/layout";
import {Content, Header, Statistic, SubsubTitle} from "../components/text";
import Gap from "../components/Gap";
import {useHistory} from "react-router-dom";
import {largerThan} from "../utils/styledComponents";

import SplashENSLogo from '../assets/imgs/SplashENSLogo.svg'
import Divider from "../components/Divider";

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
        hasReverseRecord: addressDetails?.has_reverse_record,
        rawBalance: addressDetails?.balance
    })
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

const ClaimEnsTokenContainer = styled.div`
    display: flex;
    flex-direction: column;
    
    ${largerThan.tablet`
        flex-direction: row;
    `}
`

const LeftContainer = styled.div`
    margin-bottom: 50px;
    min-width: 350px;
    
    ${largerThan.tablet`
        margin-bottom: 0px;
    `}
`

const RightContainer = styled.div`
     ${largerThan.tablet`
        margin-left: 50px;
    `}
`

const ENSLogo = styled.img`
    width: 40px;
    margin-top: 5px;
    margin-left: 10px;
`

const SmallENSLogo = styled(ENSLogo)`
    width: 25px;
    margin-top: 1px;
    margin-left: 5px;
    margin-right: -4px;
`

const StatsSubtitle = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.01em;
    
    color: #717171;
    
    opacity: 0.6;
`

const RowLabel = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.01em;
    color: #717171;
`

const StatsRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
`

const StatsSection = styled.div`
  margin-bottom: 35px;  
`

const StatsNumber = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.01em;
    color: #000000;
`

const NumberWithLogoContainer = styled.div`
   display: flex;
   align-items: center; 
`

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
        rawBalance,
        hasReverseRecord
    } = useClaimData(address)
    const history = useHistory();

    return (
        <ClaimEnsTokenContainer>
            <LeftContainer>
                <StatsSection>
                    <StatsRow>
                        <StatsSubtitle>Rewards</StatsSubtitle>
                    </StatsRow>
                    <StatsRow>
                        <RowLabel>Historical activity: </RowLabel>
                        <NumberWithLogoContainer>
                            <StatsNumber>{pastTokens}</StatsNumber><SmallENSLogo src={SplashENSLogo}/>
                        </NumberWithLogoContainer>
                    </StatsRow>
                    <Divider/>
                    <StatsRow>
                        <RowLabel>Future registrations: </RowLabel>
                        <NumberWithLogoContainer>
                            <StatsNumber>{futureTokens}</StatsNumber><SmallENSLogo src={SplashENSLogo}/>
                        </NumberWithLogoContainer>
                    </StatsRow>
                    {hasReverseRecord && (
                        <>
                            <Divider/>
                            <StatsRow>
                                <RowLabel>Reverse record is set: </RowLabel>
                                <NumberWithLogoContainer>
                                    <StatsNumber>2x</StatsNumber>
                                </NumberWithLogoContainer>
                            </StatsRow>
                        </>
                    )}
                </StatsSection>

                <StatsSection>
                    <StatsRow>
                        <StatsSubtitle>Fun facts</StatsSubtitle>
                    </StatsRow>
                    <StatsRow>
                        <RowLabel>Longest owned: </RowLabel>
                        <NumberWithLogoContainer>
                            <StatsNumber>{longestOwnedName}</StatsNumber>
                        </NumberWithLogoContainer>
                    </StatsRow>
                    <Divider/>
                    <StatsRow>
                        <RowLabel>Longest renewed: </RowLabel>
                        <NumberWithLogoContainer>
                            <StatsNumber>{lastExpiringName}</StatsNumber>
                        </NumberWithLogoContainer>
                    </StatsRow>
                </StatsSection>
            </LeftContainer>
            <RightContainer>
                <NarrowColumn>
                    <ContentBox>
                        <Header>Claim your tokens</Header>
                        <Gap height={3}/>
                        <Content>
                            You are eligible for the retroactive airdrop! View your activity below, and initiate the
                            transaction to claim them.
                        </Content>
                        <Gap height={5}/>
                        <InnerContentBox>
                            <SubsubTitle>You will receive</SubsubTitle>
                            <Gap height={1}/>
                            <Statistic>{balance}<ENSLogo src={SplashENSLogo}/></Statistic>
                        </InnerContentBox>
                        <Gap height={5}/>
                        <Content>
                            You have received these rewards for being an early and active participant of the ENS
                            community. We hope that you use the power granted by these tokens wisely!
                        </Content>
                        <Gap height={5}/>
                    </ContentBox>
                    <Footer
                        rightButtonText="Claim your tokens"
                        rightButtonCallback={handleClaim(address, rawBalance)}
                        leftButtonText="Choose your delegate"
                    />
                </NarrowColumn>
            </RightContainer>
        </ClaimEnsTokenContainer>
    );
};

export default ClaimEnsToken;
