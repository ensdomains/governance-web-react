import React, { useEffect, useState } from "react";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Client } from "@snapshot-labs/snapshot.js";

import Footer from "../../components/Footer";
import { Content, Header } from "../../components/text";
import { ContentBox, NarrowColumn } from "../../components/layout";
import Gap from "../../components/Gap";
import { useHistory } from "react-router-dom";
import { getEthersProvider } from "../../web3modal";
import TransactionState from "../../components/TransactionState";
import { PROPOSAL_ID, SPACE_ID } from "../../utils/consts";
import { getChoices } from "./constitutionHelpers";

const handleVote = async (setVoteState, address, history) => {
  const snapshotClient = new Client();
  const ethersProvider = getEthersProvider();
  try {
    setVoteState({
      state: "LOADING",
      message: "",
    });
    await snapshotClient.vote(ethersProvider, address, SPACE_ID, {
      proposal: PROPOSAL_ID,
      choice: getChoices(address),
    });
    setVoteState({
      state: "SUCCESS",
      message: "",
    });
    return setTimeout(() => {
      history.push("/delegates");
    }, 2000);
  } catch (error) {
    setVoteState({
      state: "ERROR",
      message: error,
    });
  }
};

const ENS_CONSTITUTION_SIGN_QUERY = gql`
  query privateRouteQuery @client {
    isConnected
    address
  }
`;

const ENSConstitutionSign = ({ location }) => {
  const { data } = useQuery(ENS_CONSTITUTION_SIGN_QUERY);
  const history = useHistory();
  const [voteState, setVoteState] = useState({
    state: "LOADING",
    message: "",
  });

  useEffect(() => {
    let timeout
    const run = async () => {
      if (location.state && data.isConnected) {
        timeout = await handleVote(setVoteState, data.address, history);
      }
    }

    run()
    return () => {
      console.log('unmount: ', timeout)
      if(timeout) {
        clearTimeout(timeout)
      }
    }
  }, [data.isConnected, data.address]);

  return (
    <NarrowColumn>
      <ContentBox>
        <Header>Confirm with wallet</Header>
        <Gap height={3} />
        <Content>
          Please approve the signing request to submit your votes.
        </Content>
        <Gap height={6} />
        <TransactionState
          transactionState={voteState.state}
          title={"Submit votes"}
          content={
            "This message is signed off-chain, and does not cost any gas."
          }
        />
      </ContentBox>
      <Footer
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/constitution");
        }}
        rightButtonText={
          voteState.state === "SUCCESS" ? "Continuing..." : "Try Again"
        }
        rightButtonCallback={() => {
          if (voteState.state === "SUCCESS") {
            history.push("/delegates");
            return;
          }
          handleVote(setVoteState, data.address, history);
        }}
        disabled={
          voteState.state === "LOADING" || voteState.state === "SUCCESS"
            ? "disabled"
            : ""
        }
      />
    </NarrowColumn>
  );
};

export default ENSConstitutionSign;
