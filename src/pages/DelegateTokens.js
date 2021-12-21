import React, { useEffect, useState } from "react";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Client } from "@snapshot-labs/snapshot.js";
import { BigNumber, Contract } from "ethers";

import Footer from "../components/Footer";
import { Content, Header } from "../components/text";
import { ContentBox, NarrowColumn } from "../components/layout";
import Gap from "../components/Gap";
import { useHistory } from "react-router-dom";
import { getEthersProvider } from "../web3modal";
import TransactionState from "../components/TransactionState";
import merkleRoot from "../assets/root.json";
import ShardedMerkleTree from "../merkle";
import Pill from "../components/Pill";
import { delegate, delegateBySig } from "../utils/token";
import { generateMerkleShardUrl } from "../utils/consts";
import { delegateSigDetails, selectedDelegateReactive } from "../apollo";

const delegateToAddress = async (
  setClaimState,
  history,
  selectedDelegate,
  sigDetails
) => {
  try {
    setClaimState({
      state: "LOADING",
      message: "",
    });

    let delegateAddress;
    let provider = getEthersProvider();

    const displayName = selectedDelegate;
    if (!displayName) {
      throw "No chosen delegate";
    }

    if (displayName.includes(".eth")) {
      delegateAddress = await provider.resolveName(displayName);
    } else {
      delegateAddress = displayName;
    }
    const tx =
      sigDetails && sigDetails.canSign
        ? await delegateBySig(
            delegateAddress,
            setClaimState,
            history,
            sigDetails.nonce
          )
        : await delegate(delegateAddress, setClaimState, history);
    selectedDelegateReactive("");
    return tx;
  } catch (error) {
    console.error(error);
    setClaimState({
      state: "ERROR",
      message: error,
    });
  }
};

const getRightButtonText = (state) => {
  switch (state) {
    case "LOADING":
      return "Delegating...";
    case "SUCCESS":
      return "Continuing...";
    case "ERROR":
      return "Try again";
  }
};

const ENSTokenClaim = ({ location }) => {
  const {
    data: {
      isConnected,
      address,
      selectedDelegate,
      delegateSigDetails: _delegateSigDetails,
    },
  } = useQuery(gql`
    query privateRouteQuery @client {
      isConnected
      address
      selectedDelegate
      delegateSigDetails
    }
  `);
  const delegateSigDetails = _delegateSigDetails && _delegateSigDetails.details;
  const history = useHistory();
  const [claimState, setClaimState] = useState({
    state: "LOADING",
    message: "",
  });

  useEffect(() => {
    let timeout;
    const run = async () => {
      if (address) {
        timeout = await delegateToAddress(
          setClaimState,
          history,
          selectedDelegate,
          delegateSigDetails
        );
      }
    };

    run();
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [address]);

  return (
    <NarrowColumn>
      {claimState.state === "ERROR" && (
        <Pill error text={claimState.message.message} />
      )}
      <ContentBox>
        <Header>Confirm with wallet</Header>
        <Gap height={3} />
        <Content>
          {delegateSigDetails?.canSign
            ? "Please sign the message to delegate your tokens"
            : "Please approve the transaction to delegate your tokens"}
        </Content>
        <Gap height={6} />
        <TransactionState
          transactionState={claimState.state}
          title={"Delegate"}
          content={
            delegateSigDetails?.canSign
              ? "This transaction happens on-chain but is subsidised by the ENS DAO and does not require paying gas"
              : "This transaction happens on-chain, and will require paying gas"
          }
        />
      </ContentBox>
      <Footer
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/delegate-ranking");
        }}
        rightButtonText={getRightButtonText(claimState.state)}
        rightButtonCallback={() => {
          if (claimState.state === "SUCCESS") {
            history.push("/delegate-ranking");
            return;
          }
          delegateToAddress(
            setClaimState,
            history,
            selectedDelegate,
            delegateSigDetails
          );
        }}
        disabled={claimState.state === "LOADING" ? "disabled" : ""}
      />
    </NarrowColumn>
  );
};

export default ENSTokenClaim;
