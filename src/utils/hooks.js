import { normalize } from "@ensdomains/eth-ens-namehash";
import { Contract, ethers } from "ethers";
import { gql } from "graphql-tag";
import { keccak_256 as sha3 } from "js-sha3";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  apolloClientInstance,
  delegatedTo,
  delegates as delegatesReactive,
  delegateSigDetails as delegateSigDetailsReactive,
  tokensOwned,
} from "../apollo";
import ENSDelegateAbi from "../assets/abis/ENSDelegate.json";
import ENSTokenAbi from "../assets/abis/ENSToken.json";
import ReverseRecordsAbi from "../assets/abis/ReverseRecords.json";
import { getDelegateReferral } from "../pages/ENSConstitution/delegateHelpers";
import { getEthersProvider } from "../web3modal";
import {
  ALLOCATION_ENDPOINT,
  getENSDelegateContractAddress,
  getENSTokenContractAddress,
  getReverseRecordsAddress,
} from "./consts";
import { getCanDelegateBySig } from "./utils";

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
  results
    ?.filter((result) => result.profile.length > 0)
    .map((result) => {
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

const TARGET_DELEGATE_SIZE = 0.025;
// This function ranks delegates by delegated vote total until they reach the
// target percentage of all delegated votes, at which point their ranking begins to decrease.
const generateRankingScore = (score, total, name) => {
  if (score > total * TARGET_DELEGATE_SIZE) {
    score = Math.max(2 * total * TARGET_DELEGATE_SIZE - score, 0);
  }
  return score;
};

const addBalance = (cleanList, tokensDelegated) => {
  return cleanList.map((item) => {
    return {
      ...item,
      ranking:
        generateRankingScore(item.votes, tokensDelegated, item.name) *
        Math.random(),
    };
  });
};

export const rankDelegates = (
  delegateList,
  tokensDelegated,
  prepopDelegate
) => {
  const cleanList = cleanDelegatesList(delegateList);
  const withTokenBalance = addBalance(
    cleanList,
    tokensDelegated,
    prepopDelegate
  );
  const sortedList = withTokenBalance.sort((x, y) => {
    if (x.name == prepopDelegate) return -1;
    if (y.name == prepopDelegate) return 1;
    return y.ranking - x.ranking;
  });
  return sortedList;
};

export const useGetDelegates = (isConnected) => {
  const [delegates, setDelegates] = useState({});
  const [tokenInfo, setTokenInfo] = useState({});
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
      let results = await Promise.all(
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

      const tokensDelegated = processedDelegateDataWithReverse
        .map((delegate) => delegate.votes)
        .reduce((a, b) => a.add(b))
        .div(ethers.utils.parseEther("1"))
        .toNumber();
      const rankedDelegates = await rankDelegates(
        processedDelegateDataWithReverse,
        tokensDelegated,
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

export const useGetTokens = (address) => {
  const [balance, setBalance] = useState();
  const [loading, setLoading] = useState(true);
  const provider = getEthersProvider();
  const ENSTokenContract = new Contract(
    getENSTokenContractAddress(),
    ENSTokenAbi.abi,
    provider
  );

  useEffect(() => {
    async function run() {
      const balance = await ENSTokenContract.balanceOf(address);
      console.log(balance);
      setBalance(balance);
      setLoading(false);
    }
    if (address) {
      run();
    }
  }, [address]);

  tokensOwned({ balance, loading });
};

export const useGetDelegatedTo = (address) => {
  const [delegatedToAddress, setDelegatedToAddress] = useState();
  const [loading, setLoading] = useState(true);
  const provider = getEthersProvider();
  const ENSTokenContract = new Contract(
    getENSTokenContractAddress(),
    ENSTokenAbi.abi,
    provider
  );

  useEffect(() => {
    async function run() {
      const delegatedToAddress = await ENSTokenContract.delegates(address);
      setDelegatedToAddress(delegatedToAddress);
      setLoading(false);
    }
    if (address) {
      run();
    }
  }, [address]);

  delegatedTo({ delegatedTo: delegatedToAddress, loading });
};

export const useGetDelegateBySigStatus = (address) => {
  const [delegateSigDetails, setDelegateSigDetails] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const fetchedDelegateSigDetails = await getCanDelegateBySig(address);
      setDelegateSigDetails(fetchedDelegateSigDetails);
      setLoading(false);
    }
    if (address) {
      run();
    }
  }, [address]);

  delegateSigDetailsReactive({ details: delegateSigDetails, loading });
};

export const useGetTransactionDone = (txHash) => {
  const [transactionDone, setTransactionDone] = useState(true);
  const [loading, setLoading] = useState(true);
  const provider = getEthersProvider();

  useEffect(() => {
    async function run() {
      if (!provider) return;
      const tx = await provider.getTransaction(txHash);
      setTransactionDone(tx.blockNumber !== null);
      setLoading(false);
    }
    if (txHash) {
      run();
    }
  }, [txHash, provider]);

  return transactionDone;
};
