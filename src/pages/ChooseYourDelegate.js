import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Contract} from 'ethers';
import {normalize} from '@ensdomains/eth-ens-namehash';
import {keccak_256 as sha3} from 'js-sha3';
import styled from 'styled-components';

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content} from '../components/text'
import {NarrowColumn} from "../components/layout";
import {ContentBox} from "../components/layout";
import {getEthersProvider} from "../web3modal";
import {gql} from "graphql-tag";
import {apolloClientInstance} from "../apollo";
import {useQuery} from "@apollo/client";
import ENSDelegateAbi from "../assets/abis/ENSDelegate.json";
import {imageUrl} from "../utils/utils";
import SpeechBubble from '../assets/imgs/SpeechBubble.svg'
import {getDelegateChoice, setDelegateChoice} from "./ENSConstitution/delegateHelpers";
import {CTAButton} from "../components/buttons";

const DELEGATE_TEXT_QUERY = gql`
    query delegateTextQuery {
        resolvers(where:{texts_contains:["eth.ens.delegate"]}) {
            address
            addr {
                id
            }
            domain {
              name
              resolver { address }
            }
          }
    }
`

export function namehash(inputName) {
    let node = ''
    for (let i = 0; i < 32; i++) {
        node += '00'
    }

    if (inputName) {
        const labels = inputName.split('.')

        for (let i = labels.length - 1; i >= 0; i--) {
            let labelSha
            let normalisedLabel = normalize(labels[i])
            labelSha = sha3(normalisedLabel)
            node = sha3(new Buffer(node + labelSha, 'hex'))
        }
    }

    return '0x' + node
}

const processENSDelegateContractResults = (results, delegateData) =>
    results?.map(result => {
        const data = delegateData.find(data => data.addr.id === result.addr.toLowerCase())
        return ({
            avatar: result.avatar,
            profile: result.profile,
            address: result.addr,
            votes: result.votes,
            name: data.domain.name
        })
    })

const useGetDelegates = (isConnected) => {
    const [delegates, setDelegates] = useState([])
    useEffect(() => {
        const provider = getEthersProvider()
        const run = async () => {
            const {data: delegateData} = await apolloClientInstance.query({query: DELEGATE_TEXT_QUERY})
            const delegateNamehashes = delegateData.resolvers.map(result => namehash(result.domain.name))
                .reduce((a,i)=>a.concat(i,i),[])
                .reduce((a,i)=>a.concat(i,i),[])

            const ENSDelegateContract = new Contract(
                '0xd8A54d061BdBB8A1EEFD68d437470B9aBF294c24',
                ENSDelegateAbi.abi,
                provider
            )

            const results = await ENSDelegateContract.getDelegates(delegateNamehashes)
            setDelegates(processENSDelegateContractResults(results, delegateData?.resolvers))
            console.log('results: ', results)
        }
        try {
            if (isConnected) {
                run()
            }
        } catch (error) {
            console.error('Error getting delegates: ', error)
        }
    }, [isConnected])
    return delegates
}

const CHOOSE_YOUR_DELEGATE_QUERY = gql`
  query privateRouteQuery @client {
    addressDetails
    isConnected
  }
`

const DelegateBoxContainer = styled.div`
  border: 1px solid ${ p => p.selected ? 'rgba(73, 179, 147, 1)' : 'rgba(0, 0, 0, 0.08)'};
  box-sizing: border-box;
  border-radius: 16px;
  display: flex;
  height: 80px;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
  
  
`

const AvatarImg = styled.img`
    border-radius: 50%;
    width: ${p => p.large ? '60px' : '50px'};
    height: ${p => p.large ? '60px' : '50px'};
    margin-right: 10px;
`

const MidContainer = styled.div`
`

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`

const SpeechBubbleImg = styled.img`
  margin-right: 15px;
`

const DelegateBox = ({avatar, profile, votes, name, setRenderKey}, idx) => {
    const selected = name === getDelegateChoice()
    return (
        <DelegateBoxContainer
            key={idx}
            onClick={() => {
                setDelegateChoice(name)
                setRenderKey(x => x+1)
            }}
            selected={selected}
        >
            <LeftContainer>
                <AvatarImg src={imageUrl(avatar, name, 1)}/>
                <MidContainer>
                    {name}
                    <div>
                        Votes:
                        {votes.toNumber()}
                    </div>
                </MidContainer>
            </LeftContainer>
            <a href={profile} target={"_blank"}>
                <SpeechBubbleImg src={SpeechBubble}/>
            </a>
        </DelegateBoxContainer>
    )
}


const WrappedNarrowColumn = styled(NarrowColumn)`
    max-width: 960px;
`

const DelegatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 290px);
  grid-row-gap: 12px;
  grid-column-gap: 15px;
  justify-content: center;
`

const CopyContianer = styled.div`
  display: flex;
`

const WrappedCTAButton = styled(CTAButton)`
  width: 210px;
  margin-left: 70px;
`

const ChooseYourDelegate = () => {
    const {data: chooseData} = useQuery(CHOOSE_YOUR_DELEGATE_QUERY)
    const history = useHistory()
    const delegates = useGetDelegates(chooseData.isConnected)
    const [renderKey, setRenderKey] = useState(0)

    return (
        <WrappedNarrowColumn>
            <ContentBox>
                <CopyContianer>
                    <div>
                        <Header>Choose a delegate</Header>
                        <Gap height={3}/>
                        <Content>
                            Select a community member whose views you align with, who will be able to vote with the power of
                            your tokens.
                        </Content>
                    </div>
                    <div>
                        <WrappedCTAButton
                            text={"Enter ENS or address"}
                            type={"deny"}
                            onClick={() => {
                                history.push('/manual-delegates')
                            }}
                        />
                    </div>
                </CopyContianer>

                <Gap height={5}/>
                <DelegatesContainer>
                    {delegates.map(x => ({...x, setRenderKey})).map(DelegateBox)}
                </DelegatesContainer>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/constitution')
                }}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/governance')
                }}
                disabled={!getDelegateChoice()}
            />
        </WrappedNarrowColumn>
    );
};

export default ChooseYourDelegate;
