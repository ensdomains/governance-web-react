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
import {imageUrl, shortenAddress} from "../utils/utils";
import SpeechBubble from '../assets/imgs/SpeechBubble.svg'
import {getDelegateChoice, setDelegateChoice} from "./ENSConstitution/delegateHelpers";
import {CTAButton} from "../components/buttons";
import {largerThan} from "../utils/styledComponents";
import GreenTick from "../assets/imgs/GreenTick.svg";
import {getENSDelegateContractAddress} from "../utils/consts";

const DELEGATE_TEXT_QUERY = gql`
    query delegateTextQuery {
        resolvers(where:{texts_contains:["eth.ens.delegate"]}, first: 1000) {
            address
            texts
            addr {
                id
            }
            domain {
              id
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
            console.log('labels: ', labels[i])
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

const filterDelegateData = (results) => {
    return results
        .filter(data => data.addr?.id)
        .filter(data => data.texts?.includes('avatar'))
        .filter(data => data.address === data.domain.resolver.address)
}

const useGetDelegates = (isConnected) => {
    const [delegates, setDelegates] = useState([])
    useEffect(() => {
        const provider = getEthersProvider()
        const run = async () => {
            const {data: delegateData} = await apolloClientInstance.query({query: DELEGATE_TEXT_QUERY})
            const filteredDelegateData = filterDelegateData(delegateData.resolvers)
            const delegateNamehashes = filteredDelegateData.map(result => result.domain.id)

            const ENSDelegateContract = new Contract(
                getENSDelegateContractAddress(),
                ENSDelegateAbi.abi,
                provider
            )

            const results = await ENSDelegateContract.getDelegates(delegateNamehashes)
            setDelegates(processENSDelegateContractResults(results, filteredDelegateData))
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
  border: 1px solid ${p => p.selected ? 'rgba(73, 179, 147, 1)' : 'rgba(0, 0, 0, 0.08)'};
  box-sizing: border-box;
  border-radius: 16px;
  display: flex;
  height: 80px;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.33s cubic-bezier(0.83, 0, 0.17, 1);
  position: relative;
  
  &:hover {
    border: 1px solid ${p => p.selected ? 'rgba(73, 179, 147, 1)' : '#5298FF'};
  }
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
  filter: invert(77%) sepia(33%) saturate(10%) hue-rotate(33deg) brightness(90%) contrast(86%);
  
  &:hover {
    filter: invert(51%) sepia(97%) saturate(1961%) hue-rotate(196deg) brightness(103%) contrast(101%);
  }
`

const SpeechBubbleImgText = styled.img`
    margin: 0 5px;
    filter: invert(77%) sepia(33%) saturate(10%) hue-rotate(33deg) brightness(90%) contrast(86%);
`

const Logo = styled.img`
  position: absolute;
  top: -11px;
  right: -11px;
  width: 23px;
  height: 23px;
`

const DelegateBoxName = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 25px;
  display: flex;
  align-items: center;

  color: #323232;
`

const DelegateBoxVotes = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: #989898;
`

const DelegateBox = ({avatar, profile, votes, name, setRenderKey}, idx) => {
    const selected = name === getDelegateChoice()
    return (
        <DelegateBoxContainer
            key={idx}
            onClick={() => {
                setDelegateChoice(name)
                setRenderKey(x => x + 1)
            }}
            selected={selected}
        >
            {selected && <Logo src={GreenTick} />}
            <LeftContainer>
                <AvatarImg
                    src={imageUrl(avatar, name, 1)}
                    onError={(e) => {e.target.onerror = null; e.target.src="https://placeimg.com/200/200/animals"}}
                />
                <MidContainer>
                    <DelegateBoxName>
                        {shortenAddress(name, 16)}
                    </DelegateBoxName>
                    <DelegateBoxVotes>
                        {`${votes.toNumber()} `}
                        votes
                    </DelegateBoxVotes>
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
  grid-column-gap: 14px;
  justify-content: center;
`

const HeaderContianer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  
  ${largerThan.mobile`
    flex-direction: row;
    margin-bottom: 20px;
  `}
`

const WrappedCTAButton = styled(CTAButton)`
  width: 210px;
  margin: 0 auto;
  
  ${largerThan.mobile`
      margin-left: 70px;
  `}
`

const CopyContainer = styled.div`
  margin-bottom: 20px;

  ${largerThan.mobile`
     margin-bottom: 0px;
  `}
`

const ChooseYourDelegate = () => {
    const {data: chooseData} = useQuery(CHOOSE_YOUR_DELEGATE_QUERY)
    const history = useHistory()
    const delegates = useGetDelegates(chooseData.isConnected)
    const [renderKey, setRenderKey] = useState(0)

    return (
        <WrappedNarrowColumn>
            <ContentBox>
                <HeaderContianer>
                    <CopyContainer>
                        <Header>Choose a delegate</Header>
                        <Gap height={3}/>
                        <Content>
                            Select a community member to represent you. You can change this at any time. Click on the<SpeechBubbleImgText src={SpeechBubble}/>icon to read their application.
                        </Content>
                        <Gap height={2}/>
                        <Content style={{fontSize: 15}}>
                            You can delegate to someone not listed, or to yourself, by entering an ENS name or Ethereum address with the button on the right.
                        </Content>
                    </CopyContainer>
                    <div>
                        <WrappedCTAButton
                            text={"Enter ENS or address"}
                            type={"deny"}
                            onClick={() => {
                                history.push('/manual-delegates')
                            }}
                        />
                    </div>
                </HeaderContianer>
                <DelegatesContainer>
                    {delegates.map(x => ({...x, setRenderKey})).map(DelegateBox)}
                </DelegatesContainer>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/summary')
                }}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/constitution')
                }}
                disabled={!getDelegateChoice()}
            />
        </WrappedNarrowColumn>
    );
};

export default ChooseYourDelegate;
