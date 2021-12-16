import { getEthersProvider } from "../web3modal";
import { BigNumber, Contract } from "ethers";
import ENSTokenAbi from "../assets/abis/ENSToken.json";
import MerkleAirdropAbi from "../assets/abis/MerkleAirdrop.json";
import merkleRoot from "../assets/root.json";
import ep2MerkleRoot from "../assets/ep2root.json";
import ShardedMerkleTree, { getIndex } from "../merkle";
import {
  GAS_LIMIT,
  generateMerkleShardUrl,
  getENSTokenContractAddress,
  getMerkleAirdropContractAddress,
} from "./consts";

export const hasClaimed = async (address, type = "mainnet") => {
  try {
    console.log("checking has claimed...");
    const response = await fetch(generateMerkleShardUrl(address, type));
    if (!response.ok) {
      console.low("didn't get url");
      throw new Error("error getting shard data");
    }

    const shardJson = await response.json({ encoding: "utf-8" });
    const { root, shardNybbles, total } =
      type === "mainnet" ? merkleRoot : ep2MerkleRoot;

    console.log("shardJson", shardJson);

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
    console.log("index is", index);
    provider
      .getCode("0xf7d9cf4de5d385b443badd000487f2fcd8983bb3")
      .then((code) => console.log(code));
    const result = await airdropContract.isClaimed(index);
    console.log("got result", entry, index, proof);
    return result;
  } catch (error) {
    console.log(error);
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
        claimTokens(balance, proof, address, { gasLimit: GAS_LIMIT });
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
      history.push(type === "mainnet" ? "" : "/ep2" + "/success");
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
