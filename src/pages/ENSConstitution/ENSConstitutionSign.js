import React, {useEffect, useState} from 'react';
import {gql} from "graphql-tag";
import {useQuery} from "@apollo/client";
import {Client} from "@snapshot-labs/snapshot.js";
import styled from 'styled-components';

import Footer from '../../components/Footer'
import {Content, Header} from '../../components/text'
import {ContentBox, NarrowColumn} from "../../components/layout";
import Gap from "../../components/Gap";
import {useHistory} from "react-router-dom";
import {getEthersProvider} from "../../web3modal";
import LoadingIndicator from '../../assets/imgs/LoadingIndicator.svg'
import WarningIndicator from '../../assets/imgs/WarningIndicator.svg'
import GreenTickIndicator from '../../assets/imgs/GreenTickIndicator.svg'
import {CTAButton} from "../../components/buttons";


const handleVote = async (setVoteState) => {
    const snapshotClient = new Client()
    const ethersProvider = getEthersProvider()
    try {
        setVoteState({
            state: 'LOADING',
            message: ''
        })
        await snapshotClient.vote(
            ethersProvider,
            '0xBe8563B89d31AD287c73da42848Bd7646172E0ba',
            'bananana.eth',
            {proposal: 'QmerF9zBj9QNk3evSTigCdmfQ1SdS2MN4yfCkyHZCd8tcy', choice: [1]}
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
  }
`

const Logo = styled.img`
  animation: ${p => {
    switch (p.type) {
      case 'LOADING':
        return 'rotation 2s infinite linear'
      default:
        return 'initial'
    }
  }};

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`

const getLogoSrc = type => {
    switch (type) {
        case 'LOADING':
            return LoadingIndicator
        case 'ERROR':
            return WarningIndicator
        case 'SUCCESS':
            return GreenTickIndicator
        default:
            return ''
    }
}

const TransactionStateTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 141%;
  color: #1A1A1A;
`

const TransactionStateContent = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 141%;

  color: #1A1A1A;
`

const TransactionStateContainer = styled.div`
  display: flex;
`

const TransactionContentContainer = styled.div`
  margin-left: 20px;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const TransactionState = ({transactionState, title, content}) =>
    <TransactionStateContainer>
        <LogoContainer>
            <Logo
                type={transactionState}
                src={getLogoSrc(transactionState)}
            />
        </LogoContainer>
        <TransactionContentContainer>
            <TransactionStateTitle>{title}</TransactionStateTitle>
            <TransactionStateContent>{content}</TransactionStateContent>
        </TransactionContentContainer>
    </TransactionStateContainer>

const ENSConstitutionSign = ({location}) => {
    const {data} = useQuery(ENS_CONSTITUTION_SIGN_QUERY)
    const history = useHistory();
    const [voteState, setVoteState] = useState({
        state: 'LOADING',
        message: ''
    })
    console.log('voteState: ', voteState)
    console.log('location: ', location)

    useEffect(() => {
        if (location.state && data.isConnected) {
            handleVote(setVoteState)
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
                        handleVote(setVoteState)
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
