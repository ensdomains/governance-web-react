import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import Footer from "../components/Footer";
import Gap from "../components/Gap";
import Loader from "../components/Loader";
import { Header, Content } from "../components/text";
import { NarrowColumn } from "../components/layout";
import { ContentBox } from "../components/layout";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import SpeechBubble from "../assets/imgs/SpeechBubble.svg";

import { CTAButton } from "../components/buttons";
import { largerThan } from "../utils/styledComponents";
import GreenTick from "../assets/imgs/GreenTick.svg";
import { keccak_256 as sha3_256 } from "js-sha3";
import { shortenAddress } from "../utils/utils";

import { getDelegateChoice } from "./ENSConstitution/delegateHelpers";
import { useGetDelegates } from "../utils/hooks";

const USER_INFO_QUERY = gql`
  query chooseDelegateQuery @client {
    isConnected
    address
  }
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

const DelegateBox = ({ address, discourseLink, selected, setSelected }) => {
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
          <DelegateBoxName data-testid="delegate-box-name">
            {shortenAddress(address)}
          </DelegateBoxName>
        </MidContainer>
      </LeftContainer>
      <ProfileLink
        href={`https://${discourseLink}`}
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

  ${largerThan.mobile`
      margin-left: 70px;
  `}
`;

const CopyContainer = styled.div`
  margin-bottom: 20px;

  ${largerThan.mobile`
    margin-bottom: 0px;
  `}
`;

const ChooseYourDelegate = () => {
  const { data } = useQuery(USER_INFO_QUERY);

  const [selected, setSelected] = useState(null);

  const { delegates, isLoading } = useGetDelegates();

  const history = useHistory();

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
              entering an Ethereum address with the button on the right.
            </Content>
          </CopyContainer>

          <div>
            <WrappedCTAButton
              text="Enter an address"
              type={"deny"}
              onClick={() => {
                history.push("/manual-delegates");
              }}
            />
          </div>
        </HeaderContainer>
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
          rightButtonText="Next"
          rightButtonCallback={() => {
            history.push("/summary");
          }}
          leftButtonText="Back"
          leftButtonCallback={() => {
            localStorage.removeItem("delegate");
            history.push("/governance");
          }}
          disabled={!getDelegateChoice(data?.address)}
        />
      ) : (
        <Footer rightButtonText={"Loading..."} disabled />
      )}
    </WrappedNarrowColumn>
  );
};

export default ChooseYourDelegate;
