import { useQuery } from "@apollo/client";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { utils } from "ethers";
import { gql } from "graphql-tag";
import React, { Fragment, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { selectedDelegateReactive } from "../apollo";
import GradientAvatar from "../assets/imgs/Gradient.svg";
import GreenTick from "../assets/imgs/GreenTick.svg";
import SpeechBubble from "../assets/imgs/SpeechBubble.svg";
import { CTAButton } from "../components/buttons";
import EtherscanBox from "../components/EtherscanBox";
import Footer from "../components/Footer";
import Gap from "../components/Gap";
import { ContentBox, NarrowColumn } from "../components/layout";
import LazyImage from "../components/LazyImage";
import Loader from "../components/Loader";
import Profile from "../components/Profile";
import { Content, Header, SubTitle } from "../components/text";
import { emptyAddress } from "../utils/consts";
import {
  useGetDelegateBySigStatus,
  useGetDelegatedTo,
  useGetTokens,
  useGetTransactionDone,
} from "../utils/hooks";
import { largerThan } from "../utils/styledComponents";
import { imageUrl } from "../utils/utils";

const DELEGATE_RANKING_QUERY = gql`
  query delegateRankingQuery @client {
    addressDetails
    delegates
    tokensOwned
    delegatedTo
    delegateSigDetails
    selectedDelegate
  }
`;

const DelegateBoxContainer = styled.div`
  border: 1px solid
    ${(p) => (p.selected ? "rgba(73, 179, 147, 1)" : "rgba(0, 0, 0, 0.08)")};
  box-sizing: border-box;
  border-radius: 16px;
  display: ${(p) => (p.search ? "flex" : "none")};
  height: 80px;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
  cursor: ${({ alreadyDelegated }) =>
    alreadyDelegated ? "default" : "pointer"};
  transition: all 0.33s cubic-bezier(0.83, 0, 0.17, 1);
  position: relative;

  ${({ alreadyDelegated }) =>
    alreadyDelegated &&
    `
      background-color: rgba(0, 0, 0, 0.08);
    `}

  ${(p) =>
    p.account
      ? `
      &:hover {
        border: 1px solid
          ${(p) => (p.selected ? "rgba(73, 179, 147, 1)" : "#5298FF")};
      }
  `
      : ""}
`;

const AvatarImg = styled.img`
  background: linear-gradient(157.05deg, #9fc6ff -5%, #256eda 141.71%);
  border-radius: 50%;
  width: ${(p) => (p.large ? "60px" : "50px")};
  height: ${(p) => (p.large ? "60px" : "50px")};
  margin-right: 10px;
`;

const MidContainer = styled.div`
  overflow: hidden;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 32px);
`;

const SpeechBubbleImg = styled.img`
  filter: invert(77%) sepia(33%) saturate(10%) hue-rotate(33deg) brightness(90%)
    contrast(86%);

  &:hover {
    filter: invert(51%) sepia(97%) saturate(1961%) hue-rotate(196deg)
      brightness(103%) contrast(101%);
  }
`;

const SpeechBubbleImgText = styled.img`
  margin: 0 5px;
  filter: invert(77%) sepia(33%) saturate(10%) hue-rotate(33deg) brightness(90%)
    contrast(86%);
`;

const Logo = styled.img`
  position: absolute;
  top: -11px;
  right: -11px;
  width: 23px;
  height: 23px;
`;

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
`;

const ProfileLink = styled.a`
  flex-basis: auto;
`;

const DelegateBoxVotes = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: #989898;
`;

const Gradient = styled.div`
  background: linear-gradient(157.05deg, #9fc6ff -5%, #256eda 141.71%);
  width: ${(p) => (p.large ? "60px" : "50px")};
  height: ${(p) => (p.large ? "60px" : "50px")};
  border-radius: 50%;
  margin-right: 10px;
`;

const DelegateBox = (data) => {
  const {
    avatar,
    profile,
    votes,
    name,
    address,
    setRenderKey,
    userAccount,
    delegatedTo,
    search,
    selectedDelegate,
  } = data;
  const selected = name === selectedDelegate.name;
  const imageSrc = imageUrl(avatar, name, 1);
  return (
    <DelegateBoxContainer
      key={name}
      onClick={() => {
        if (delegatedTo !== address) {
          selectedDelegateReactive({ name, address });
        }
      }}
      alreadyDelegated={delegatedTo === address}
      search={search}
      selected={selected}
      account={userAccount}
    >
      {selected && <Logo src={GreenTick} />}
      <LeftContainer>
        {imageSrc ? (
          <LazyImage
            src={imageUrl(avatar, name, 1)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = GradientAvatar;
            }}
            ImageComponent={AvatarImg}
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
  );
};

const WrappedNarrowColumn = styled(NarrowColumn)`
  max-width: 960px;
`;

const DelegatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-row-gap: 12px;
  grid-column-gap: 14px;
  padding: 10px 30px 30px;
  justify-content: center;
  max-height: calc(100vh / 3);
  overflow-y: auto;
  pointer-events: ${(props) => (props.balance === 0 ? "none" : "auto")};
  opacity: ${(props) => (props.balance === 0 ? 0.4 : 1)};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  padding: 30px 30px 0;

  ${largerThan.mobile`
    flex-direction: row;
    margin-bottom: 20px;
  `}
`;

const WrappedCTAButton = styled(CTAButton)`
  width: 210px;
  margin: 0 auto;
  cursor: auto;
  ${(p) =>
    p.account &&
    `
    cursor: pointer;
  `}
  ${largerThan.mobile`
      margin-left: 70px;
  `};
`;

const CopyContainer = styled.div`
  margin-bottom: 20px;

  ${largerThan.mobile`
     margin-bottom: 0px;
  `}
`;

const SubHeader = styled.div`
  display: grid;
  margin: 0 30px 10px;
  grid-template-columns: 1fr;
  grid-row-gap: 12px;
  grid-column-gap: 14px;
  ${largerThan.tablet`
    grid-template-columns: 2fr minmax(240px, 290px);
  `}
`;

const Input = styled.input`
  font-family: inherit;
  height: 64px;
  box-sizing: border-box;
  -webkit-appearance: none;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #f6f6f6;
  border-radius: 14px;
  padding: 0px 20px;

  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;

  &::placeholder {
    color: black;
    opacity: 0.23;
  }
`;

const Clear = styled("button")`
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 10px 16px;
  cursor: pointer;
  margin-left: auto;

  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 21px;
  text-align: center;
  letter-spacing: -0.01em;

  color: #63666a;
`;

const CurrentDelegationContainer = styled("div")`
  background: #f6f6f6;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  border-radius: 16px;
  padding: 10px 15px;
  display: flex;
  align-items: center;

  span {
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 21px;
    letter-spacing: -0.01em;
    margin-right: 10px;
    padding: 10px 0;

    color: rgba(26, 26, 26, 0.75);

    strong {
      font-weight: bold;
      color: black;
    }
  }
`;

const FreeDelegationHeader = styled(Header)`
  font-size: 22px;
  display: inline-block;
`;

const FreeDelegationSubTitle = styled(SubTitle)`
  display: inline-block;
`;

const FreeDelegationContentBox = styled(ContentBox)`
  display: flex;
  padding: 15px 30px;
  flex-direction: row;
  justify-content: space-between;
`;

function CurrentDelegation({ tokens, selection, delegatedTo }) {
  let text = (
    <>
      <span>
        You have delegated <strong>{tokens}</strong> votes to
      </span>
      <Profile address={delegatedTo} size="small" />
    </>
  );

  if (selection) {
    text = (
      <>
        <span>
          You will delegate <strong>{tokens}</strong> votes to
        </span>
        <Profile address={selection} size="small" />
      </>
    );
  }

  if (!selection && delegatedTo === emptyAddress) {
    text = (
      <span>
        You have <strong>{tokens}</strong> undelegated votes
      </span>
    );
  }

  if (tokens === "0.00") {
    text = (
      <>
        <span>You have no tokens to delegate.</span>
      </>
    );
  }

  return (
    <CurrentDelegationContainer data-testid="current-delegation">
      {text}
      {selection !== null && (
        <Clear
          onClick={() => {
            selectedDelegateReactive({ name: null, address: null });
          }}
        >
          Clear
        </Clear>
      )}
    </CurrentDelegationContainer>
  );
}

const ChooseYourDelegate = () => {
  const { open, close } = useWeb3Modal();
  const { chainId, address, isConnected } = useWeb3ModalAccount();
  const { data: chooseData } = useQuery(DELEGATE_RANKING_QUERY);
  useGetTokens(address);
  useGetDelegatedTo(address);
  // useGetDelegateBySigStatus(address);
  const { delegates, loading: delegatesLoading } = chooseData.delegates;
  const { balance, loading: balanceLoading } = chooseData.tokensOwned;
  const { delegatedTo, loading: delegatedToLoading } = chooseData.delegatedTo;
  const { details: delegateSigDetails, loading: delegateSigDetailsLoading } =
    chooseData.delegateSigDetails;
  const { selectedDelegate } = chooseData;

  const history = useHistory();
  const location = useLocation();

  const transactionDone = useGetTransactionDone(
    location.state && location.state.hash
  );

  const [renderKey, setRenderKey] = useState(0);
  const [search, setSearch] = useState("");

  const simpleBalance =
    !balanceLoading && balance ? Number(utils.formatEther(balance)) : 0;

  return (
    <WrappedNarrowColumn>
      {!transactionDone && (
        <>
          <EtherscanBox
            message="Your transaction is pending"
            transactionHash={location.state.hash}
          />
          <Gap height={3} />
        </>
      )}
      {chooseData?.address && (
        <FreeDelegationContentBox>
          {delegateSigDetails?.next !== undefined ? (
            <Fragment>
              <FreeDelegationHeader>
                {!delegateSigDetails?.canSign &&
                delegateSigDetails?.formattedDate
                  ? `You will be eligible for gas free-delegation ${
                      delegateSigDetails?.formattedDate.split(" ")[0]
                    }`
                  : "You are eligible for gas free-delegation"}
              </FreeDelegationHeader>
              <FreeDelegationSubTitle>
                {!delegateSigDetails?.canSign &&
                delegateSigDetails?.formattedDate
                  ? delegateSigDetails?.formattedDate.split(" ")[1]
                  : ""}
              </FreeDelegationSubTitle>
            </Fragment>
          ) : !delegateSigDetailsLoading ? (
            <FreeDelegationHeader>
              You're not eligible for gas-free delegation
            </FreeDelegationHeader>
          ) : (
            <FreeDelegationHeader>
              Checking gas-free delegation eligibility...
            </FreeDelegationHeader>
          )}
        </FreeDelegationContentBox>
      )}

      <Gap height={3} />
      <ContentBox padding={"none"}>
        <HeaderContainer>
          <CopyContainer>
            <Header>Change your delegate</Header>
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
            {address ? (
              <WrappedCTAButton
                text={"Enter ENS or address"}
                type={simpleBalance === 0 ? "disabled" : "deny"}
                onClick={() => {
                  if (address) {
                    history.push("/manual-delegates-no-claim");
                  }
                }}
                account={address}
                disabled={address && selectedDelegate.name}
              />
            ) : (
              <WrappedCTAButton
                text={"Connect to Enter ENS or address"}
                onClick={() => {
                  open();
                }}
              />
            )}
          </div>
        </HeaderContainer>
        <SubHeader account={address}>
          {address &&
            (balanceLoading ? null : (
              <CurrentDelegation
                account={address}
                tokens={
                  balance ? Number(utils.formatEther(balance)).toFixed(2) : 0
                }
                selection={selectedDelegate.name}
                delegatedTo={delegatedTo}
                setRenderKey={setRenderKey}
              />
            ))}
          <Input
            account={address}
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </SubHeader>
        {delegatesLoading ? (
          <Loader center large />
        ) : (
          <DelegatesContainer
            data-testid="delegates-list-container"
            balance={simpleBalance}
          >
            {delegates.map((d) => (
              <DelegateBox
                {...d}
                selectedDelegate={selectedDelegate}
                key={d.name}
                address={d.address}
                userAccount={address}
                delegatedTo={delegatedTo}
                search={d.name.includes(search)}
              />
            ))}
          </DelegatesContainer>
        )}
      </ContentBox>
      {address &&
        (!delegateSigDetailsLoading ? (
          <Footer
            rightButtonText={"Delegate"}
            rightButtonCallback={() => {
              history.push("/delegate-tokens");
            }}
            text={delegateSigDetails?.canSign ? "Gas Free" : "Requires Gas"}
            subText={
              delegateSigDetails?.formattedDate !== undefined &&
              "You can delegate gas-free " + delegateSigDetails?.formattedDate
            }
            disabled={
              !selectedDelegate.address ||
              selectedDelegate.address === delegatedTo
            }
          />
        ) : (
          <Footer rightButtonText={"Loading..."} disabled />
        ))}
    </WrappedNarrowColumn>
  );
};

export default ChooseYourDelegate;
