import React, { useEffect, useState } from "react"
import { Client } from "@snapshot-labs/snapshot.js"
import { useQuery } from "@apollo/client"
import { gql } from "graphql-tag"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { utils } from "ethers"

import { ContentBox, InnerContentBox, NarrowColumn } from "../components/layout"
import {
  DecimalBalance,
  Header,
  IntegerBalance,
  Statistic,
  SubsubTitle,
} from "../components/text"
import Gap from "../components/Gap"
import { getEthersProvider } from "../web3modal"
import { imageUrl, shortenAddress } from "../utils/utils"
import { CTAButton } from "../components/buttons"
import SplashENSLogo from "../assets/imgs/SplashENSLogo.svg"
import { getDelegateChoice } from "./ENSConstitution/delegateHelpers"
import Pill from "../components/Pill"

const ENSLogo = styled.img`
  width: 40px;
  margin-left: 10px;
`

const AvatarImg = styled.img`
  border-radius: 50%;
  width: ${(p) => (p.large ? "60px" : "50px")};
  height: ${(p) => (p.large ? "60px" : "50px")};
  margin-right: 10px;
`

const WrappedInnerContentBox = styled(InnerContentBox)`
  display: flex;
`

const LeftContainer = styled.div`
  flex: 1;
  width: calc(100% - 60px);
`

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`

const DelegateInfoContainer = styled.div`
  display: flex;
  align-items: center;
`

const DelegateName = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 26px;
  line-height: 141%;
  color: #000000;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DelegateConfirmation = ({ isDelegateValid, setIsDelegateValid }) => {
  const {
    data: { isConnected, address },
  } = useQuery(gql`
    query privateRouteQuery @client {
      isConnected
      address
    }
  `)
  const [delegateInfo, setDelegateInfo] = useState({
    avatar: "",
    displayName: "",
  })
  const history = useHistory()

  useEffect(() => {
    const run = async () => {
      const delegateChoice = getDelegateChoice(address)

      if (!delegateChoice) {
        console.error("No delegate selected")
        return
      }

      if (delegateChoice.includes(".")) {
        const resolver = await getEthersProvider().getResolver(delegateChoice)
        try {
          const addr = await resolver.getAddress(60)
          utils.getAddress(addr)
          const avatar = await resolver.getText("avatar")
          setDelegateInfo({
            avatar,
            displayName: delegateChoice,
          })
          setIsDelegateValid(true)
        } catch (e) {
          setIsDelegateValid(false)
        }
        return
      }

      const ethName = await getEthersProvider().lookupAddress(delegateChoice)
      if (ethName) {
        const resolver = await getEthersProvider().getResolver(ethName)
        const avatar = await resolver.getText("avatar")
        setDelegateInfo({
          avatar,
          displayName: ethName,
        })
        setIsDelegateValid(true)
        return
      }

      setDelegateInfo({
        avatar: null,
        address: delegateChoice,
      })
      setIsDelegateValid(true)
    }
    if (isConnected) {
      run()
    }
  }, [isConnected])

  return (
    <WrappedInnerContentBox>
      <LeftContainer>
        <SubsubTitle>You're delegating to</SubsubTitle>
        <Gap height={2} />
        <DelegateInfoContainer>
          {delegateInfo.avatar && (
            <AvatarImg
              src={imageUrl(delegateInfo.avatar, delegateInfo.displayName, 1)}
            />
          )}
          <DelegateName>
            {delegateInfo.displayName
              ? delegateInfo.displayName
              : shortenAddress(delegateInfo.address)}
          </DelegateName>
        </DelegateInfoContainer>
      </LeftContainer>
      <RightContainer>
        <CTAButton
          onClick={() => {
            history.push("/delegates")
          }}
          type={"deny"}
          text={"Edit"}
        />
      </RightContainer>
    </WrappedInnerContentBox>
  )
}

const EnsSummary = () => {
  const {
    data: { address, addressDetails },
  } = useQuery(gql`
    query privateRouteQuery @client {
      address
      addressDetails
      isConnected
    }
  `)
  const [isDelegateValid, setIsDelegateValid] = useState(undefined)
  const history = useHistory()

  const { balance } = addressDetails

  return (
    <NarrowColumn>
      {isDelegateValid === false ? (
        <Pill error text={"Delegate is invalid, click edit to pick another"} />
      ) : (
        <Pill
          text={
            isDelegateValid === undefined
              ? "Checking delegate validity"
              : "Delegate is valid!"
          }
        />
      )}
      <ContentBox>
        <Header>Review your claim</Header>
        <Gap height={3} />
        <InnerContentBox>
          <SubsubTitle>You will receive</SubsubTitle>
          <Gap height={1} />
          <Statistic>
            <IntegerBalance>{balance?.split(".")[0]}</IntegerBalance>
            <DecimalBalance>.{balance?.split(".")[1]}</DecimalBalance>
            <ENSLogo src={SplashENSLogo} />
          </Statistic>
        </InnerContentBox>
        <Gap height={3} />
        <DelegateConfirmation
          isDelegateValid={isDelegateValid}
          setIsDelegateValid={setIsDelegateValid}
        />
        <Gap height={5} />
        <CTAButton
          onClick={() => {
            history.push({
              pathname: "/summary/claim",
              state: "CLAIM",
            })
          }}
          text={
            isDelegateValid === undefined
              ? "Checking delegate validity..."
              : "Claim"
          }
          type={isDelegateValid ? "" : "disabled"}
        />
      </ContentBox>
    </NarrowColumn>
  )
}

export default EnsSummary
