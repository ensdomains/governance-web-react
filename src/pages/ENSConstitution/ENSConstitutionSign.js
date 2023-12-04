import React, { useEffect, useState } from "react";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Client712 } from "@snapshot-labs/snapshot.js";
import Footer from "../../components/Footer";
import { Content, Header } from "../../components/text";
import { ContentBox, NarrowColumn } from "../../components/layout";
import Gap from "../../components/Gap";
import { useHistory } from "react-router-dom";
import { getEthersProvider } from "../../web3modal";
import TransactionState from "../../components/TransactionState";
import { PROPOSAL_ID, SNAPSHOT_TIMEOUT, SPACE_ID } from "../../utils/consts";
import { getChoices } from "./constitutionHelpers";
import SeamTokenAbi from "../../assets/abis/Seam.json";
import EsSeamTokenAbi from "../../assets/abis/EsSeam.json";
import { Contract } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const handleVote = async (setVoteState, address, history) => {
  const snapshotClient = new Client712("https://testnet.hub.snapshot.org");
  const ethersProvider = getEthersProvider();

  try {
    setVoteState({
      state: "LOADING",
      message: "",
    });
    let timeout;
    try {
      await Promise.race([
        snapshotClient.vote(ethersProvider, address, {
          space: SPACE_ID,
          proposal: PROPOSAL_ID,
          type: "approval-voting",
          choice: getChoices(address),
        }),
        new Promise((_, reject) => {
          timeout = setTimeout(() => {
            reject("Error with signing vote please try again");
          }, SNAPSHOT_TIMEOUT);
        }),
      ]);
    } catch (e) {
      console.log(e);
    }

    setVoteState({
      state: "SUCCESS",
      message: "",
    });

    return setTimeout(async () => {
      const provider = getEthersProvider();
      const signer = provider.getSigner();

      const seamTokenContract = new Contract(
        SeamTokenAbi.address,
        SeamTokenAbi.abi,
        signer
      );
      seamTokenContract.connect(signer);
      const seamDelegate = await seamTokenContract.delegates(address);

      const esSeamTokenContract = new Contract(
        EsSeamTokenAbi.address,
        EsSeamTokenAbi.abi,
        signer
      );
      esSeamTokenContract.connect(signer);
      const esSeamDelegate = await esSeamTokenContract.delegates(address);

      if (seamDelegate !== ZERO_ADDRESS && esSeamDelegate !== ZERO_ADDRESS) {
        history.push("/claim");
      } else {
        history.push("/delegates");
      }
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

const getRightButtonText = (state) => {
  switch (state) {
    case "LOADING":
      return "Signing...";
    case "SUCCESS":
      return "Continuing...";
    case "EROR":
      return "Try again";
    default:
      return "Try again";
  }
};

const ENSConstitutionSign = ({ location }) => {
  const { data } = useQuery(ENS_CONSTITUTION_SIGN_QUERY);
  const history = useHistory();
  const [voteState, setVoteState] = useState({
    state: "LOADING",
    message: "",
  });

  useEffect(() => {
    let timeout;
    const run = async () => {
      if (location.state && data.isConnected) {
        timeout = await handleVote(setVoteState, data.address, history);
      }
    };

    run();
    return () => {
      console.log("unmount: ", timeout);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [data.isConnected, data.address]);

  return (
    <NarrowColumn>
      <ContentBox>
        <Header>Confirm with wallet</Header>
        <Gap height={2} />
        <Content>
          Please approve the signing request to submit your votes.
        </Content>
        <Gap height={7} />
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
        rightButtonText={getRightButtonText(voteState.state)}
        rightButtonCallback={() => {
          if (voteState.state === "SUCCESS") {
            history.push("/delegate-ranking");
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
