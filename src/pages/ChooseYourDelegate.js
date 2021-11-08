import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Contract } from "ethers"
import { normalize } from "@ensdomains/eth-ens-namehash"
import { keccak_256 as sha3 } from "js-sha3"
import styled from "styled-components"

import Footer from "../components/Footer"
import Gap from "../components/Gap"
import Loader from "../components/Loader"
import { Header, Content } from "../components/text"
import { NarrowColumn } from "../components/layout"
import { ContentBox } from "../components/layout"
import { getEthersProvider } from "../web3modal"
import { gql } from "graphql-tag"
import { apolloClientInstance } from "../apollo"
import { useQuery } from "@apollo/client"
import ENSDelegateAbi from "../assets/abis/ENSDelegate.json"
import ReverseRecordsAbi from "../assets/abis/ReverseRecords.json"
import ENSTokenAbi from "../assets/abis/ENSToken.json"
import { imageUrl, shortenAddress } from "../utils/utils"
import SpeechBubble from "../assets/imgs/SpeechBubble.svg"
import GradientAvatar from "../assets/imgs/Gradient.svg"
import {
  getDelegateChoice,
  setDelegateChoice,
  getDelegateReferral,
} from "./ENSConstitution/delegateHelpers"
import { CTAButton } from "../components/buttons"
import { largerThan } from "../utils/styledComponents"
import GreenTick from "../assets/imgs/GreenTick.svg"

import {
  ALLOCATION_ENDPOINT,
  getENSDelegateContractAddress,
  getENSTokenContractAddress,
  getReverseRecordsAddress,
} from "../utils/consts"

const DELEGATE_TEXT_QUERY = gql`
  query delegateTextQuery {
    resolvers(
      where: { texts_contains: ["eth.ens.delegate", "avatar"] }
      first: 1000
    ) {
      address
      texts
      addr {
        id
      }
      domain {
        id
        name
        resolver {
          address
        }
      }
    }
  }
`

const TARGET_DELEGATE_SIZE = 0.025

export function namehash(inputName) {
  let node = ""
  for (let i = 0; i < 32; i++) {
    node += "00"
  }

  if (inputName) {
    const labels = inputName.split(".")

    for (let i = labels.length - 1; i >= 0; i--) {
      let labelSha
      let normalisedLabel = normalize(labels[i])
      labelSha = sha3(normalisedLabel)
      node = sha3(new Buffer(node + labelSha, "hex"))
    }
  }

  return "0x" + node
}

const processENSDelegateContractResults = (results, delegateData) =>
  results?.map((result) => {
    const data = delegateData.find((data) => {
      return data.addr.id.toLowerCase() === result.addr.toLowerCase()
    })
    return {
      avatar: result.avatar,
      profile: result.profile,
      address: result.addr,
      votes: result.votes,
      name: data?.domain?.name,
    }
  })

const filterDelegateData = (results) => {
  return results
    .filter((data) => data.addr?.id)
    .filter((data) => data.texts?.includes("avatar"))
    .filter((data) => data.address === data.domain.resolver.address)
}

const bigNumberToDecimal = (bigNumber) =>
  Number(bigNumber.toBigInt() / window.BigInt(Math.pow(10, 18)))

const stringToInt = (numberString) =>
  Number(window.BigInt(numberString) / window.BigInt(Math.pow(10, 18)))

const cleanDelegatesList = (delegatesList) =>
  delegatesList.map((delegateItem) => ({
    avatar: delegateItem.avatar,
    profile: delegateItem.profile,
    address: delegateItem.address?.toLowerCase(),
    name: delegateItem.name,
    votes: bigNumberToDecimal(delegateItem.votes),
    ranking: bigNumberToDecimal(delegateItem.votes),
  }))

// This function ranks delegates by delegated vote total until they reach the
// target percentage of all delegated votes, at which point their ranking begins to decrease.
const generateRankingScore = (score, total, prepopDelegate, name) => {
  if (score > total * TARGET_DELEGATE_SIZE) {
    score = Math.max(2 * total * TARGET_DELEGATE_SIZE - score, 0)
  }
  return score + (prepopDelegate === name ? 100000000 : 0)
}

const addBalance = async (
  cleanList,
  tokenAllocation,
  tokensClaimed,
  prepopDelegate
) => {
  return cleanList.map((item) => {
    let allocation = tokenAllocation.find((x) => x.address === item.address)
    return {
      ...item,
      ranking:
        generateRankingScore(
          item.votes + allocation.score,
          tokensClaimed,
          prepopDelegate,
          item.name
        ) * Math.random(),
      allocation: allocation.score,
    }
  })
}

const rankDelegates = async (
  delegateList,
  tokenAllocation,
  tokensClaimed,
  prepopDelegate
) => {
  const cleanList = cleanDelegatesList(delegateList)
  const withTokenBalance = await addBalance(
    cleanList,
    tokenAllocation,
    tokensClaimed,
    prepopDelegate
  )
  const sortedList = withTokenBalance.sort((x, y) => y.ranking - x.ranking)
  return sortedList
}

const fetchTokenAllocations = async (addressArray) => {
  try {
    const url = `${ALLOCATION_ENDPOINT}?addresses=${addressArray.join(",")}`
    const allocations = await fetch(url)
    const json = await allocations.json()
    const integerScores = json.score.map((x) => ({
      address: x.address?.toLowerCase(),
      score: stringToInt(x.score),
    }))
    return integerScores
  } catch (error) {
    console.error("fetchTokenAllocations error: ", error)
  }
}

const createNamehashBatches = (namehashes, perBatch = 2) => {
  var result = namehashes.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perBatch)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
  return result
}

const useGetDelegates = (isConnected) => {
  const [delegates, setDelegates] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const provider = getEthersProvider()
    const run = async () => {
      const { data: delegateData } = await apolloClientInstance.query({
        query: DELEGATE_TEXT_QUERY,
      })
      const filteredDelegateData = filterDelegateData(delegateData.resolvers)
      const delegateNamehashes = filteredDelegateData.map(
        (result) => result.domain.id
      )

      const ENSTokenContract = new Contract(
        getENSTokenContractAddress(),
        ENSTokenAbi.abi,
        provider
      )

      const ENSDelegateContract = new Contract(
        getENSDelegateContractAddress(),
        ENSDelegateAbi.abi,
        provider
      )

      const ReverseRecordsContract = new Contract(
        getReverseRecordsAddress(),
        ReverseRecordsAbi,
        provider
      )

      const batches = createNamehashBatches(delegateNamehashes, 50)

      const results = await Promise.all(
        batches.map((batch) => ENSDelegateContract.getDelegates(batch))
      )
      const flatResults = results?.flat()

      const processedDelegateData = processENSDelegateContractResults(
        flatResults,
        filteredDelegateData
      )

      const addresses = processedDelegateData.map((data) => data.address)
      const names = await ReverseRecordsContract.getNames(addresses)
      const processedDelegateDataWithReverse = processedDelegateData.filter(
        (d, i) => d.name == names[i]
      )
      const tokenAllocations = await fetchTokenAllocations(addresses)
      const tokensLeft = await ENSTokenContract.balanceOf(
        ENSTokenContract.address
      )
      // Actual number of tokens claimed, plus total of delegates' own airdrops.
      const tokensClaimed =
        25000000 -
        bigNumberToDecimal(tokensLeft) +
        tokenAllocations.reduce((total, current) => total + current.score, 0)
      console.log({ target: tokensClaimed * TARGET_DELEGATE_SIZE })
      const rankedDelegates = await rankDelegates(
        processedDelegateDataWithReverse,
        tokenAllocations,
        tokensClaimed,
        getDelegateReferral()
      )
      setDelegates(rankedDelegates)
      setLoading(false)
    }

    try {
      if (isConnected) {
        run()
      }
    } catch (error) {
      console.error("Error getting delegates: ", error)
    }
  }, [isConnected])
  return {
    loading,
    delegates,
  }
}

const CHOOSE_YOUR_DELEGATE_QUERY = gql`
  query chooseDelegateQuery @client {
    addressDetails
    isConnected
    address
  }
`

const DelegateBoxContainer = styled.div`
  border: 1px solid
    ${(p) => (p.selected ? "rgba(73, 179, 147, 1)" : "rgba(0, 0, 0, 0.08)")};
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
    border: 1px solid
      ${(p) => (p.selected ? "rgba(73, 179, 147, 1)" : "#5298FF")};
  }
`

const AvatarImg = styled.img`
  background: linear-gradient(157.05deg, #9fc6ff -5%, #256eda 141.71%);
  border-radius: 50%;
  width: ${(p) => (p.large ? "60px" : "50px")};
  height: ${(p) => (p.large ? "60px" : "50px")};
  margin-right: 10px;
`

const MidContainer = styled.div`
  overflow: hidden;
`

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 32px);
`

const SpeechBubbleImg = styled.img`
  filter: invert(77%) sepia(33%) saturate(10%) hue-rotate(33deg) brightness(90%)
    contrast(86%);

  &:hover {
    filter: invert(51%) sepia(97%) saturate(1961%) hue-rotate(196deg)
      brightness(103%) contrast(101%);
  }
`

const SpeechBubbleImgText = styled.img`
  margin: 0 5px;
  filter: invert(77%) sepia(33%) saturate(10%) hue-rotate(33deg) brightness(90%)
    contrast(86%);
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
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: #323232;
`

const ProfileLink = styled.a`
  flex-basis: auto;
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

const Gradient = styled.div`
  background: linear-gradient(157.05deg, #9fc6ff -5%, #256eda 141.71%);
  width: ${(p) => (p.large ? "60px" : "50px")};
  height: ${(p) => (p.large ? "60px" : "50px")};
  border-radius: 50%;
  margin-right: 10px;
`

const DelegateBox = (data) => {
  const { avatar, profile, votes, name, setRenderKey, userAccount } = data
  const selected = name === getDelegateChoice(userAccount)
  const imageSrc = imageUrl(avatar, name, 1)
  console.log(imageSrc)
  return (
    <DelegateBoxContainer
      key={name}
      onClick={() => {
        setDelegateChoice(userAccount, name)
        setRenderKey((x) => x + 1)
      }}
      selected={selected}
    >
      {selected && <Logo src={GreenTick} />}
      <LeftContainer>
        {imageSrc ? (
          <AvatarImg
            src={imageUrl(avatar, name, 1)}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = GradientAvatar
            }}
          />
        ) : (
          <Gradient />
        )}
        <MidContainer>
          <DelegateBoxName data-testid="delegate-box-name">
            {name}
          </DelegateBoxName>
          <DelegateBoxVotes>{Math.floor(votes)} votes</DelegateBoxVotes>
        </MidContainer>
      </LeftContainer>
      <ProfileLink
        href={profile}
        target={"_blank"}
        onClick={(e) => e.stopPropagation()}
      >
        <SpeechBubbleImg src={SpeechBubble} />
      </ProfileLink>
    </DelegateBoxContainer>
  )
}

const WrappedNarrowColumn = styled(NarrowColumn)`
  max-width: 960px;
`

const DelegatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-row-gap: 12px;
  grid-column-gap: 14px;
  padding: 0px 30px 10px;
  justify-content: center;
  max-height: calc(100vh / 3);
  overflow-y: auto;
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  padding: 30px 30px 0;

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

const Input = styled.input`
  height: 64px;
  width: calc(100% - 60px);
  box-sizing: border-box;
  -webkit-appearance: none;
  outline: none;
  border: none;
  background: #f6f6f6;
  border-radius: 14px;
  padding: 0px 20px;

  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;

  margin: 0 30px 10px;

  &::placeholder {
    color: black;
    opacity: 0.23;
  }
`

const ChooseYourDelegate = () => {
  const { data: chooseData } = useQuery(CHOOSE_YOUR_DELEGATE_QUERY)
  const history = useHistory()
  const { delegates, loading: delegatesLoading } = useGetDelegates(
    chooseData.isConnected
  )
  const [renderKey, setRenderKey] = useState(0)
  const [search, setSearch] = useState("")

  return (
    <WrappedNarrowColumn>
      <ContentBox padding={"none"}>
        <HeaderContainer>
          <CopyContainer>
            <Header>Choose a delegate</Header>
            <Gap height={3} />
            <Content>
              Select a community member to represent you. You can change this at
              any time. Click on the
              <SpeechBubbleImgText src={SpeechBubble} />
              icon to read their application.
            </Content>
            <Gap height={2} />
            <Content style={{ fontSize: 15 }}>
              You can delegate to someone not listed, or to yourself, by
              entering an ENS name or Ethereum address with the button on the
              right.
            </Content>
          </CopyContainer>

          <div>
            <WrappedCTAButton
              text={"Enter ENS or address"}
              type={"deny"}
              onClick={() => {
                history.push("/manual-delegates")
              }}
            />
          </div>
        </HeaderContainer>
        <Input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search delegates"
        />
        {delegatesLoading ? (
          <Loader center large />
        ) : (
          <DelegatesContainer data-testid="delegates-list-container">
            {delegates
              .filter((x) => x.name.includes(search))
              .map((x) => ({
                ...x,
                setRenderKey,
                userAccount: chooseData.address,
              }))
              .map(DelegateBox)}
          </DelegatesContainer>
        )}
      </ContentBox>
      <Footer
        rightButtonText="Next"
        rightButtonCallback={() => {
          history.push("/summary")
        }}
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/constitution")
        }}
        disabled={!getDelegateChoice(chooseData?.address)}
      />
    </WrappedNarrowColumn>
  )
}

export default ChooseYourDelegate
