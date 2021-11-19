import { getEthersProvider } from "../web3modal";
import { BigNumber, Contract, ethers } from "ethers";
import ENSTokenAbi from "../assets/abis/ENSToken.json";
import merkleRoot from "../assets/root.json";
import ShardedMerkleTree, { getIndex } from "../merkle";
import {
  GAS_LIMIT,
  generateMerkleShardUrl,
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
    console.log("result: ", result);
    return result;
  } catch (error) {
    return false;
    console.error("error in hasClaimed: ", error);
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
      history.push("/success");
    }, 2000);
  } catch (error) {
    console.error(error);
    setClaimState({
      state: "ERROR",
      message: error,
    });
  }
}
