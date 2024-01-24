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
import { BigNumber } from "ethers/lib";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";

const ETH_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function useQueryString() {
  return new URLSearchParams(useLocation().search);
}

const generateDelegateQuery = (skip = 0) => gql`
  query delegateTextQuery {
    resolvers(
      where: { texts_contains: ["eth.ens.delegate", "avatar"] }
      first: 1000
      skip: ${skip}
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

const processENSDelegateContractResults = (
  flatGetDelegatesResults,
  reverseRecordOnly
) =>
  reverseRecordOnly.map((reverseRecordOnlyResult) => {
    const data = flatGetDelegatesResults.find((getDelegateResult) => {
      return (
        reverseRecordOnlyResult.addr.id.toLowerCase() ===
        getDelegateResult.addr.toLowerCase()
      );
    });
    return {
      avatar: data?.avatar,
      profile: data?.profile,
      address: data?.addr,
      votes: data?.votes || BigNumber.from(0),
      name: reverseRecordOnlyResult?.domain?.name,
    };
  });

const filterDelegateData = (results) => {
  return results
    .filter((data) => {
      return data.addr?.id || data.addr?.id === ETH_ZERO_ADDRESS;
    })
    .filter((data) => {
      return data?.texts?.includes("avatar");
    })
    .filter((data) => data?.address === data?.domain?.resolver?.address);
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
  const withTokenBalance = addBalance(cleanList, tokensDelegated);
  const sortedList = withTokenBalance.sort((x, y) => {
    if (x.name == prepopDelegate) return -1;
    if (y.name == prepopDelegate) return 1;
    return y.ranking - x.ranking;
  });
  return sortedList;
};

export const useGetDelegates = (isConnected) => {
  const [delegates, setDelegates] = useState({});
  const [loading, setLoading] = useState(true);
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    const provider = getEthersProvider(walletProvider);
    console.log("walletProvider: ", walletProvider);

    const run = async () => {
      const delegateDataRaw = await Promise.all([
        apolloClientInstance.query({
          query: generateDelegateQuery(),
        }),
        apolloClientInstance.query({
          query: generateDelegateQuery(1000),
        }),
        apolloClientInstance.query({
          query: generateDelegateQuery(2000),
        }),
      ]);

      const filteredDelegateData = filterDelegateData(
        delegateDataRaw.map((x) => x.data.resolvers).flat()
      );
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
      let getDelegatesResults = await Promise.all(
        batches.map((batch) => ENSDelegateContract.getDelegates(batch))
      );
      const flatGetDelegateResults = getDelegatesResults?.flat();

      const addresses = flatGetDelegateResults.map((data) => data[0]);
      const names = await ReverseRecordsContract.getNames(addresses);

      const reverseRecordOnly = filteredDelegateData.filter((x) => {
        return names.find((name) => name === x.domain.name);
      });

      const processedDelegateData = processENSDelegateContractResults(
        flatGetDelegateResults,
        reverseRecordOnly
      );

      const tokensDelegated = processedDelegateData
        .map((delegate) => delegate.votes)
        .reduce((a, b) => a.add(b))
        .div(ethers.utils.parseEther("1"))
        .toNumber();
      const rankedDelegates = await rankDelegates(
        processedDelegateData,
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
  const { walletProvider } = useWeb3ModalProvider();
  const provider = getEthersProvider(walletProvider);
  const ENSTokenContract = new Contract(
    getENSTokenContractAddress(),
    ENSTokenAbi.abi,
    provider
  );

  useEffect(() => {
    async function run() {
      const balance = await ENSTokenContract.balanceOf(address);
      console.log("contract balance: ", balance);
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
  const { walletProvider } = useWeb3ModalProvider();
  const provider = getEthersProvider(walletProvider);
  const ENSTokenContract = new Contract(
    getENSTokenContractAddress(),
    ENSTokenAbi.abi,
    provider
  );

  useEffect(() => {
    async function run() {
      console.log("delegatedToAddressContract: ", ENSTokenContract);
      console.log("delegatedToAddressInput: ", address);
      console.log("delegatedToAddressWallet: ", walletProvider);
      const delegatedToAddress = await ENSTokenContract.delegates(address);
      console.log("delegatedToAddress: ", delegatedToAddress);
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
  const { walletProvider } = useWeb3ModalProvider();
  const provider = getEthersProvider(walletProvider);

  useEffect(() => {
    async function run() {
      if (!provider) return;
      try {
        const tx = await provider.getTransaction(txHash);
        setTransactionDone(tx?.blockNumber !== null);
      } catch {
        console.log("caught error");
      }
    }
    if (txHash) {
      run();
    }
  }, [txHash, provider]);

  return transactionDone;
};
