import React, { useEffect, useState } from "react";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";

import Footer from "../../components/Footer";
import { Content, Header } from "../../components/text";
import { ContentBox, NarrowColumn } from "../../components/layout";
import Gap from "../../components/Gap";
import { useHistory } from "react-router-dom";
import TransactionState from "../../components/TransactionState";
import Pill from "../../components/Pill";
import { handleClaim } from "../../utils/token";

const getRightButtonText = (state) => {
  switch (state) {
    case "LOADING":
      return "Claiming...";
    case "SUCCESS":
      return "Continuing...";
    case "ERROR":
      return "Try again";
  }
};

const ENSEP2TokenClaim = ({ location }) => {
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
      console.log(location.state);
      if (location.state === "EP2CLAIM" && isConnected) {
        timeout = await handleClaim(address, setClaimState, history, "ep2");
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
        <Content>Please approve the transaction to claim your tokens.</Content>
        <Gap height={6} />
        <TransactionState
          transactionState={claimState.state}
          title="Claim tokens"
          content="This transaction happens on-chain, and will require paying gas"
        />
      </ContentBox>
      <Footer
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/ep2/summary");
        }}
        rightButtonText={getRightButtonText(claimState.state)}
        rightButtonCallback={() => {
          if (claimState.state === "SUCCESS") {
            history.push("/ep2/success");
            return;
          }
          handleClaim(address, setClaimState, history, "ep2");
        }}
        disabled={claimState.state === "LOADING" ? "disabled" : ""}
      />
    </NarrowColumn>
  );
};

export default ENSEP2TokenClaim;
