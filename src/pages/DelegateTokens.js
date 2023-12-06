import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import EtherscanBox from "../components/EtherscanBox";
import Footer from "../components/Footer";
import Gap from "../components/Gap";
import { ContentBox, NarrowColumn } from "../components/layout";
import Pill from "../components/Pill";
import { Content, Header } from "../components/text";
import TransactionState from "../components/TransactionState";
import { delegate } from "../utils/token";
import { getDelegateChoice } from "./ENSConstitution/delegateHelpers";
const ethereumjs = require("ethereumjs-util");

const delegateToAddress = async (
  setClaimState,
  history,
  delegateAddress,
  sigDetails
) => {
  try {
    setClaimState({
      state: "LOADING",
      message: "",
    });

    if (!delegateAddress || delegateAddress === "") {
      throw new Error("No chosen delegate");
    }

    const tx =
      // sigDetails && sigDetails.canSign
      //   ? await delegateBySig(
      //       delegateAddress,
      //       setClaimState,
      //       history,
      //       sigDetails.nonce
      //     )
      //   :
      await delegate(
        ethereumjs.toChecksumAddress(delegateAddress),
        setClaimState,
        history
      );
    localStorage.removeItem("delegate");
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
    case "QUEUED":
      return "Return to delegates";
    case "ERROR":
      return "Try again";
    default:
      return "Try again";
  }
};

const ENSTokenClaim = () => {
  const {
    data: { address },
  } = useQuery(gql`
    query privateRouteQuery @client {
      address
    }
  `);

  const delegateAddress = getDelegateChoice(address);
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
          delegateAddress
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
          {/* {delegateSigDetails?.canSign
            ? "Please sign the message to delegate your tokens" */}
          Please approve the transaction to delegate your tokens
        </Content>
        <Gap height={6} />
        <TransactionState
          transactionState={
            claimState.state === "QUEUED" ? "SUCCESS" : claimState.state
          }
          title={"Delegate"}
          content={
            // delegateSigDetails?.canSign
            //   ? "This transaction happens on-chain, but is subsidised and does not require paying gas"
            "This transaction happens onchain, and will require paying gas"
          }
        />
      </ContentBox>
      {claimState.state === "QUEUED" && (
        <>
          <Gap height={3} />
          <EtherscanBox
            message="Your transaction is queued"
            transactionHash={claimState.message}
          />
        </>
      )}
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
          } else if (claimState.state === "QUEUED") {
            // history.push("/delegate-ranking", {
            //   hash: claimState.message,
            // });
          }
          delegateToAddress(setClaimState, history, delegateAddress);
        }}
        disabled={claimState.state === "LOADING" ? "disabled" : ""}
      />
    </NarrowColumn>
  );
};

export default ENSTokenClaim;
