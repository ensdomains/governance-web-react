import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { normalize } from "@ensdomains/eth-ens-namehash";
import { keccak_256 as sha3 } from "js-sha3";
import { Contract } from "ethers";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import styled from "styled-components/macro";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import { getEthersProvider } from "../web3modal";
import { apolloClientInstance } from "../apollo";
import ENSDelegateAbi from "../assets/abis/ENSDelegate.json";
import ReverseRecordsAbi from "../assets/abis/ReverseRecords.json";
import ENSTokenAbi from "../assets/abis/ENSToken.json";

import { getDelegateReferral } from "../pages/ENSConstitution/delegateHelpers";
import { delegates as delegatesReactive } from "../apollo";

import {
  ALLOCATION_ENDPOINT,
  getENSDelegateContractAddress,
  getENSTokenContractAddress,
  getReverseRecordsAddress,
} from "./consts";

export function useQueryString() {
  return new URLSearchParams(useLocation().search);
}

const DELEGATE_TEXT_QUERY = gql`
  query delegateTextQuery {
    resolvers(
      where: { texts_contains: ["eth.ens.delegate", "avatar"] }
      first: 1000
    ) {
      address
      texts
      addr {
        id
      }
      domain {
        id
        name
        resolver {
          address
        }
      }
    }
  }
`;

/* useGetDelegates */

const TARGET_DELEGATE_SIZE = 0.025;

export function namehash(inputName) {
  let node = "";
  for (let i = 0; i < 32; i++) {
    node += "00";
  }

  if (inputName) {
    const labels = inputName.split(".");

    for (let i = labels.length - 1; i >= 0; i--) {
      let labelSha;
      let normalisedLabel = normalize(labels[i]);
      labelSha = sha3(normalisedLabel);
      node = sha3(new Buffer(node + labelSha, "hex"));
    }
  }

  return "0x" + node;
}

const processENSDelegateContractResults = (results, delegateData) =>
  results?.map((result) => {
    const data = delegateData.find((data) => {
      return data.addr.id.toLowerCase() === result.addr.toLowerCase();
    });
    return {
      avatar: result.avatar,
      profile: result.profile,
      address: result.addr,
      votes: result.votes,
      name: data?.domain?.name,
    };
  });

const filterDelegateData = (results) => {
  return results
    .filter((data) => data.addr?.id)
    .filter((data) => data.texts?.includes("avatar"))
    .filter((data) => data.address === data.domain.resolver.address);
};

const bigNumberToDecimal = (bigNumber) =>
  Number(bigNumber.toBigInt() / window.BigInt(Math.pow(10, 18)));

const stringToInt = (numberString) =>
  Number(window.BigInt(numberString) / window.BigInt(Math.pow(10, 18)));

const cleanDelegatesList = (delegatesList) =>
  delegatesList.map((delegateItem) => ({
    avatar: delegateItem.avatar,
    profile: delegateItem.profile,
    address: delegateItem.address?.toLowerCase(),
    name: delegateItem.name,
    votes: bigNumberToDecimal(delegateItem.votes),
    ranking: bigNumberToDecimal(delegateItem.votes),
  }));

// This function ranks delegates by delegated vote total until they reach the
// target percentage of all delegated votes, at which point their ranking begins to decrease.
const generateRankingScore = (score, total, prepopDelegate, name) => {
  if (score > total * TARGET_DELEGATE_SIZE) {
    score = Math.max(2 * total * TARGET_DELEGATE_SIZE - score, 0);
  }
  return score + (prepopDelegate === name ? 100000000 : 0);
};

const addBalance = async (
  cleanList,
  tokenAllocation,
  tokensClaimed,
  prepopDelegate
) => {
  return cleanList.map((item) => {
    let allocation = tokenAllocation.find((x) => x.address === item.address);
    return {
      ...item,
      ranking:
        generateRankingScore(
          item.votes + allocation.score,
          tokensClaimed,
          prepopDelegate,
          item.name
        ) * Math.random(),
      allocation: allocation.score,
    };
  });
};

const rankDelegates = async (
  delegateList,
  tokenAllocation,
  tokensClaimed,
  prepopDelegate
) => {
  const cleanList = cleanDelegatesList(delegateList);
  const withTokenBalance = await addBalance(
    cleanList,
    tokenAllocation,
    tokensClaimed,
    prepopDelegate
  );
  const sortedList = withTokenBalance.sort((x, y) => y.ranking - x.ranking);
  return sortedList;
};

const fetchTokenAllocations = async (addressArray) => {
  try {
    const url = `${ALLOCATION_ENDPOINT}?addresses=${addressArray.join(",")}`;
    const allocations = await fetch(url);
    const json = await allocations.json();
    const integerScores = json.score.map((x) => ({
      address: x.address?.toLowerCase(),
      score: stringToInt(x.score),
    }));
    return integerScores;
  } catch (error) {
    console.error("fetchTokenAllocations error: ", error);
  }
};

const createItemBatches = (items, perBatch = 2) => {
  var result = items.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perBatch);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
  return result;
};

export const useGetDelegates = (isConnected) => {
  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const provider = getEthersProvider();
    const run = async () => {
      const { data: delegateData } = await apolloClientInstance.query({
        query: DELEGATE_TEXT_QUERY,
      });
      const filteredDelegateData = filterDelegateData(delegateData.resolvers);
      const delegateNamehashes = filteredDelegateData.map(
        (result) => result.domain.id
      );

      const ENSTokenContract = new Contract(
        getENSTokenContractAddress(),
        ENSTokenAbi.abi,
        provider
      );

      const ENSDelegateContract = new Contract(
        getENSDelegateContractAddress(),
        ENSDelegateAbi.abi,
        provider
      );

      const ReverseRecordsContract = new Contract(
        getReverseRecordsAddress(),
        ReverseRecordsAbi,
        provider
      );

      const batches = createItemBatches(delegateNamehashes, 50);

      const results = await Promise.all(
        batches.map((batch) => ENSDelegateContract.getDelegates(batch))
      );
      const flatResults = results?.flat();

      const processedDelegateData = processENSDelegateContractResults(
        flatResults,
        filteredDelegateData
      );

      const addresses = processedDelegateData.map((data) => data.address);
      const names = await ReverseRecordsContract.getNames(addresses);
      const processedDelegateDataWithReverse = processedDelegateData.filter(
        (d, i) => d.name == names[i]
      );

      const tokenAllocationAddressBatches = createItemBatches(addresses, 200);
      const tokenAllocationsArray = await Promise.all(
        tokenAllocationAddressBatches.map((batch) =>
          fetchTokenAllocations(batch)
        )
      );
      const tokenAllocations = tokenAllocationsArray?.flat();
      const tokensLeft = await ENSTokenContract.balanceOf(
        ENSTokenContract.address
      );
      // Actual number of tokens claimed, plus total of delegates' own airdrops.
      const tokensClaimed =
        25000000 -
        bigNumberToDecimal(tokensLeft) +
        tokenAllocations.reduce((total, current) => total + current.score, 0);
      console.log({ target: tokensClaimed * TARGET_DELEGATE_SIZE });
      const rankedDelegates = await rankDelegates(
        processedDelegateDataWithReverse,
        tokenAllocations,
        tokensClaimed,
        getDelegateReferral()
      );
      setDelegates(rankedDelegates);
      setLoading(false);
    };

    try {
      if (isConnected) {
        run();
      }
    } catch (error) {
      console.error("Error getting delegates: ", error);
    }
  }, [isConnected]);

  delegatesReactive({ delegates, loading });
};
