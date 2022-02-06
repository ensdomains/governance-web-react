import { BigNumber, Contract, providers, utils } from "ethers";
import ENSTokenAbi from "../assets/abis/ENSToken.json";
import MerkleAirdropAbi from "../assets/abis/MerkleAirdrop.json";
import ep2MerkleRoot from "../assets/root-ep2.json";
import merkleRoot from "../assets/root.json";
import ShardedMerkleTree, { getIndex } from "../merkle";
import { getDelegateChoice } from "../pages/ENSConstitution/delegateHelpers";
import { getEthersProvider } from "../web3modal";
import {
  GAS_LIMIT,
  generateMerkleShardUrl,
  getDelegateRpcURL,
  getENSTokenContractAddress,
  getMerkleAirdropContractAddress,
} from "./consts";

const testingMerkleRoot = {
  root: "0xdc11fa9fd3249811b64f70f9e0e8fd906652eece35cc97ea99fec6e5eeb7946c",
  shardNybbles: 1,
  total: "25000000000000000000000000",
};

export const hasClaimed = async (address, type = "mainnet") => {
  try {
    const response = await fetch(generateMerkleShardUrl(address, type));
    if (!response.ok) {
      throw new Error("error getting shard data");
    }

    const shardJson = await response.json({ encoding: "utf-8" });
    let root, shardNybbles, total;

    if (process.env.REACT_APP_STAGE === "testing" && type === "ep2")
      ({ root, shardNybbles, total } = testingMerkleRoot);
    else if (type === "ep2") ({ root, shardNybbles, total } = ep2MerkleRoot);
    else ({ root, shardNybbles, total } = merkleRoot);

    const shardedMerkleTree = new ShardedMerkleTree(
      () => shardJson,
      shardNybbles,
      root,
      BigNumber.from(total)
    );

    const provider = getEthersProvider();
    const signer = provider.getSigner();
    const airdropContract =
      type === "mainnet"
        ? new Contract(getENSTokenContractAddress(), ENSTokenAbi.abi, signer)
        : new Contract(
            getMerkleAirdropContractAddress(),
            MerkleAirdropAbi.abi,
            signer
          );
    const [entry, proof] = shardedMerkleTree.getProof(address);
    const index = getIndex(address, entry, proof);
    const result = await airdropContract.isClaimed(index);
    return result;
  } catch (error) {
    return false;
  }
};

export const submitClaim = async (
  balance,
  proof,
  address,
  setClaimState,
  history,
  type = "mainnet"
) => {
  try {
    const provider = getEthersProvider();
    const signer = provider.getSigner();
    let airdropContractAddress;
    let abi;
    let claimTokensFunc;
    if (type === "mainnet") {
      airdropContractAddress = getENSTokenContractAddress();
      abi = ENSTokenAbi.abi;
      claimTokensFunc = (claimTokens) =>
        claimTokens(balance, address, proof, { gasLimit: GAS_LIMIT });
    } else {
      airdropContractAddress = getMerkleAirdropContractAddress();
      abi = MerkleAirdropAbi.abi;
      claimTokensFunc = (claimTokens) =>
        claimTokens(address, balance, proof, { gasLimit: GAS_LIMIT });
    }
    const airdropContract = new Contract(airdropContractAddress, abi, signer);
    airdropContract.connect(signer);
    const result = await claimTokensFunc(airdropContract.claimTokens);
    await result.wait(1);
    setClaimState({
      state: "SUCCESS",
      message: "",
    });
    return setTimeout(() => {
      history.push((type === "mainnet" ? "" : "/ep2") + "/success");
    }, 2000);
  } catch (error) {
    console.error(error);
    setClaimState({
      state: "ERROR",
      message: error,
    });
  }
};

export async function delegate(address, setClaimState, history) {
  try {
    const provider = getEthersProvider();
    const signer = provider.getSigner();
    const ENSTokenContract = new Contract(
      getENSTokenContractAddress(),
      ENSTokenAbi.abi,
      signer
    );
    ENSTokenContract.connect(signer);
    const result = await ENSTokenContract.delegate(address);
    await result.wait(1);
    setClaimState({
      state: "SUCCESS",
      message: "",
    });
    return setTimeout(() => {
      history.push("/delegate-ranking");
    }, 2000);
  } catch (error) {
    console.error(error);
    setClaimState({
      state: "ERROR",
      message: error,
    });
  }
}

export async function delegateBySig(address, setClaimState, history, nonce) {
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // set expiry of signature to 7 days from now
  const message = {
    delegatee: address,
    nonce,
    expiry,
  };
  try {
    const provider = getEthersProvider();
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    const sig = await signer._signTypedData(
      {
        name: "Ethereum Name Service",
        version: "1",
        chainId: network.chainId,
        verifyingContract: getENSTokenContractAddress(network.chainId),
      },
      {
        Delegation: [
          { name: "delegatee", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "expiry", type: "uint256" },
        ],
      },
      message
    );
    const { r, s, v } = utils.splitSignature(sig);
    message.r = r;
    message.s = s;
    message.v = v;

    const ensDelegatorProvider = new providers.StaticJsonRpcProvider(
      getDelegateRpcURL(),
      "ropsten"
    );

    const delegateSigResponseData = await ensDelegatorProvider.send(
      "delegate",
      {
        delegatee: address,
        nonce,
        expiry,
        r,
        s,
        v,
      }
    );
    console.log(delegateSigResponseData);
    if (!delegateSigResponseData)
      throw new Error("Didn't get response from server");

    const delegateSigTransaction = await provider.getTransaction(
      delegateSigResponseData
    );
    await delegateSigTransaction.wait(1);
    setClaimState({
      state: "SUCCESS",
      message: "",
    });
    return setTimeout(() => {
      history.push("/delegate-ranking");
    }, 2000);
  } catch (error) {
    console.error(error);
    setClaimState({
      state: "ERROR",
      message: error,
    });
  }
}

export const handleClaim = async (
  address,
  setClaimState,
  history,
  type = "mainnet"
) => {
  try {
    setClaimState({
      state: "LOADING",
      message: "",
    });

    let outputAddress;
    let provider = getEthersProvider();
    let displayName;

    if (type === "mainnet") {
      displayName = getDelegateChoice(address);
      if (!displayName) {
        throw "No chosen delegate";
      }
    } else {
      displayName = address;
    }

    if (displayName.includes(".eth")) {
      outputAddress = await provider.resolveName(displayName);
    } else {
      outputAddress = displayName;
    }

    const response = await fetch(generateMerkleShardUrl(address, type));
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
      outputAddress,
      setClaimState,
      history,
      type
    );
  } catch (error) {
    console.error(error);
    setClaimState({
      state: "ERROR",
      message: error,
    });
  }
};
