import { getEthersProvider } from "../web3modal";
import { BigNumber, Contract, providers, utils } from "ethers";
import ENSTokenAbi from "../assets/abis/ENSToken.json";
import merkleRoot from "../assets/root.json";
import ShardedMerkleTree, { getIndex } from "../merkle";
import {
  GAS_LIMIT,
  generateMerkleShardUrl,
  getDelegateRpcURL,
  getENSTokenContractAddress,
} from "./consts";

export const hasClaimed = async (address) => {
  try {
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

    const provider = getEthersProvider();
    const signer = provider.getSigner();
    const ENSTokenContract = new Contract(
      getENSTokenContractAddress(),
      ENSTokenAbi.abi,
      signer
    );
    const [entry, proof] = shardedMerkleTree.getProof(address);
    const index = getIndex(address, entry, proof);
    const result = await ENSTokenContract.isClaimed(index);
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
  history
) => {
  try {
    const provider = getEthersProvider();
    const signer = provider.getSigner();
    const ENSTokenContract = new Contract(
      getENSTokenContractAddress(),
      ENSTokenAbi.abi,
      signer
    );
    ENSTokenContract.connect(signer);
    const result = await ENSTokenContract.claimTokens(balance, address, proof, {
      gasLimit: GAS_LIMIT,
    });
    await result.wait(1);
    setClaimState({
      state: "SUCCESS",
      message: "",
    });
    return setTimeout(() => {
      history.push("/success");
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
