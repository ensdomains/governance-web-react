import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import GreenTick from "../assets/imgs/GreenTick.svg";
import SpeechBubble from "../assets/imgs/SpeechBubble.svg";
import { CTAButton } from "../components/buttons";
import EtherscanBox from "../components/EtherscanBox";
import Gap from "../components/Gap";
import { ContentBox, NarrowColumn } from "../components/layout";
import Loader from "../components/Loader";
import { Content, Header } from "../components/text";
import { useGetDelegates, useGetTransactionDone } from "../utils/hooks";
import { largerThan } from "../utils/styledComponents";
import { shortenAddress } from "../utils/utils";
import { Footer } from "../components/Footer";
import { isConnected } from "../apollo";
import { initWeb3 } from "../web3modal";
import { keccak_256 as sha3_256 } from "js-sha3";
import { setDelegateChoice } from "./ENSConstitution/delegateHelpers";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import { getEnsInstance } from "../web3modal";

const merkleTreeData = require("../root.json");

const USER_INFO_QUERY = gql`
  query delegateRankingQuery @client {
    isConnected
    address
  }
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

function getRandomColor(address) {
  const hash = sha3_256.create();
  hash.update(address);
  const hashedAddress = hash.hex();

  const color = `#${hashedAddress.substring(0, 6)}`;
  return color;
}

const Gradient = styled.div`
  background: linear-gradient(
    157.05deg,
    ${(p) => p.color1} -5%,
    ${(p) => p.color2} 141.71%
  );
  width: ${(p) => (p.large ? "60px" : "50px")};
  height: ${(p) => (p.large ? "60px" : "50px")};
  border-radius: 50%;
  margin-right: 10px;
`;

const DelegateBoxContainer = styled.div`
  border: 1px solid
    ${(p) => (p.selected ? "rgba(73, 179, 147, 1)" : "rgba(0, 0, 0, 0.08)")};
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 16px;
  display: "flex";
  height: 80px;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
  transition: all 0.33s cubic-bezier(0.83, 0, 0.17, 1);
  position: relative;

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

const DelegateBox = ({ address, discourseLink, selected, setSelected }) => {
  const [displayName, setDisplayName] = useState(address);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getEnsInstance().lookupAddress(address);

        if (result) {
          setDisplayName(result);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  return (
    <DelegateBoxContainer
      key={address}
      onClick={() => setSelected(address)}
      selected={selected === address}
    >
      {selected === address && <Logo src={GreenTick} />}
      <LeftContainer>
        <Gradient
          color1={getRandomColor(address)}
          color2={getRandomColor(address)}
        />
        <MidContainer>
          <DelegateBoxName>
            {loading
              ? "Loading..."
              : displayName === address
              ? shortenAddress(address)
              : displayName}
          </DelegateBoxName>
        </MidContainer>
      </LeftContainer>
      <ProfileLink
        href={discourseLink}
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

function CurrentDelegation({
  address,
  tokens,
  selection,
  //delegatedTo,
  setSelected,
}) {
  const [displayName, setDisplayName] = useState(selection);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getEnsInstance().lookupAddress(selection);

        if (result) {
          setDisplayName(result);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selection]);

  let text;
  //  = (
  //   <>
  //     <span>
  //       You have delegated <strong>{tokens}</strong> votes to
  //     </span>
  //     {/* <Profile address={delegatedTo} size="small" /> */}
  //   </>
  // );

  if (selection) {
    text = (
      <>
        <span>
          You will delegate <strong>{tokens}</strong> votes to
        </span>
        <Gradient
          color1={getRandomColor(selection)}
          color2={getRandomColor(selection)}
        />
        {loading
          ? "Loading..."
          : displayName === address
          ? shortenAddress(address)
          : displayName}
      </>
    );
  }

  if (!selection) {
    text = (
      <span>
        You have <strong>{tokens}</strong> undelegated votes
      </span>
    );
  }

  return (
    <CurrentDelegationContainer>
      {text}
      {selection !== null && (
        <Clear onClick={() => setSelected(null)}>Clear</Clear>
      )}
    </CurrentDelegationContainer>
  );
}

const ChooseYourDelegate = () => {
  const { data: userData } = useQuery(USER_INFO_QUERY);
  const balance = merkleTreeData[userData.address];

  const [selected, setSelected] = useState(null);

  const { delegates, isLoading } = useGetDelegates();

  const history = useHistory();
  const location = useLocation();

  const { transactionDone } = useGetTransactionDone(
    location.state && location.state.hash
  );

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
      <Gap height={3} />
      <ContentBox padding={"none"}>
        <HeaderContainer>
          <CopyContainer>
            <Header>Change your delegate</Header>
            <Gap height={3} />
            <Content>
              Select a community member to represent you. You can change this at
              any time (Note: you can only delegate to 1 wallet at a time).
              Click on the <SpeechBubbleImgText src={SpeechBubble} />
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
            {userData.isConnected ? (
              <WrappedCTAButton
                text={"Enter ENS or address"}
                type={"deny"}
                onClick={() => {
                  if (userData?.address) {
                    history.push("/manual-delegates-no-claim");
                  }
                }}
                account={userData?.address}
                disabled={userData?.address && !delegates.length}
              />
            ) : (
              <WrappedCTAButton
                text={"Connect to Enter ENS or address"}
                onClick={() => {
                  initWeb3();
                }}
              />
            )}
          </div>
        </HeaderContainer>
        <SubHeader account={userData?.address}>
          {userData?.address && (
            <CurrentDelegation
              address={userData?.address}
              tokens={balance ?? 0}
              selection={selected}
              setSelected={setSelected}
            />
          )}
        </SubHeader>
        {isLoading ? (
          <Loader center large />
        ) : delegates ? (
          <DelegatesContainer>
            {delegates.map((d) => (
              <DelegateBox
                key={d.address}
                address={d.address}
                discourseLink={d.discourseLink}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </DelegatesContainer>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px",
            }}
          >
            No data
          </div>
        )}
      </ContentBox>

      {!isLoading ? (
        <Footer
          rightButtonText={"Delegate"}
          rightButtonCallback={() => {
            setDelegateChoice(userData.address, selected);
            history.push("/delegate-tokens");
          }}
          leftButtonText={"Back"}
          leftButtonCallback={() => {
            setDelegateChoice(userData.address, "");
            history.push("/governance");
          }}
          disabled={
            isLoading || !delegates.length || !transactionDone || !isConnected
          }
        />
      ) : (
        <Footer rightButtonText={"Loading..."} disabled />
      )}
    </WrappedNarrowColumn>
  );
};

export default ChooseYourDelegate;
