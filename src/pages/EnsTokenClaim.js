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
import { getDelegateChoice } from "./ENSConstitution/delegateHelpers";
import { submitClaim } from "../utils/tokenClaim";
import { generateMerkleShardUrl } from "../utils/consts";

const handleClaim = async (address, setClaimState, history) => {
  try {
    setClaimState({
      state: "LOADING",
      message: "",
    });

    let delegateAddress;
    let provider = getEthersProvider();

    const displayName = getDelegateChoice(address);
    if (!displayName) {
      throw "No chosen delegate";
    }

    if (displayName.includes(".eth")) {
      delegateAddress = await provider.resolveName(displayName);
    } else {
      delegateAddress = displayName;
    }

    const response = await fetch(generateMerkleShardUrl(address));
    if (!response.ok) {
      throw new Error("error getting shard data");
    }

    const shardJson = await response.json({ encoding: "utf-8" });
    const { root, shardNybbles, total } = merkleRoot;
    const shardedMerkleTree = new ShardedMerkleTree(
      () => shardJson,
      shardNybbles,
      root,
      BigNumber.from(total)
    );
    const [entry, proof] = shardedMerkleTree.getProof(address);
    return await submitClaim(
      entry.balance,
      proof,
      delegateAddress,
      setClaimState,
      history
    );
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
      return "Claiming...";
    case "SUCCESS":
      return "Continuing...";
    case "ERROR":
      return "Try Again";
  }
};

const ENSTokenClaim = ({ location }) => {
  const {
    data: { isConnected, address },
  } = useQuery(gql`
    query privateRouteQuery @client {
      isConnected
      address
    }
  `);
  const history = useHistory();
  const [claimState, setClaimState] = useState({
    state: "LOADING",
    message: "",
  });

  useEffect(() => {
    let timeout;
    const run = async () => {
      if (location.state && isConnected) {
        timeout = await handleClaim(address, setClaimState, history);
      }
    };

    run();
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isConnected]);

  return (
    <NarrowColumn>
      {claimState.state === "ERROR" && (
        <Pill error text={claimState.message.message} />
      )}
      <ContentBox>
        <Header>Confirm with wallet</Header>
        <Gap height={3} />
        <Content>
          Please approve the transaction to delegate and claim your tokens.
        </Content>
        <Gap height={6} />
        <TransactionState
          transactionState={claimState.state}
          title={"Delegate & claim tokens"}
          content={
            "This transaction happens on-chain, and will require paying gas"
          }
        />
      </ContentBox>
      <Footer
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/summary");
        }}
        rightButtonText={getRightButtonText(claimState.state)}
        rightButtonCallback={() => {
          if (claimState.state === "SUCCESS") {
            history.push("/success");
            return;
          }
          handleClaim(address, setClaimState, history);
        }}
        disabled={claimState.state === "LOADING" ? "disabled" : ""}
      />
    </NarrowColumn>
  );
};

export default ENSTokenClaim;
