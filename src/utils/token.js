import { BigNumber, Contract, utils, ethers } from "ethers";
import { network } from "../apollo";
import ENSTokenAbi from "../assets/abis/ENSToken.json";
import MerkleAirdropAbi from "../assets/abis/MerkleAirdrop.json";
import ep2MerkleRoot from "../assets/root-ep2.json";
import merkleRoot from "../assets/root.json";
// import ShardedMerkleTree, { getIndex } from "../merkle";
import { getDelegateChoice } from "../pages/ENSConstitution/delegateHelpers";
import { getEthersProvider } from "../web3modal";
import {
  DELEGATE_GAS_LIMIT,
  GAS_LIMIT,
  generateMerkleShardUrl,
  getENSTokenContractAddress,
  getMerkleAirdropContractAddress,
} from "./consts";
import { sendToDelegateJsonRpc } from "./utils";

export async function delegate(
  address,
  setClaimState,
  history,
  walletProvider
) {
  try {
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner();
    const ENSTokenContract = new Contract(
      getENSTokenContractAddress(),
      ENSTokenAbi.abi,
      signer
    );
    ENSTokenContract.connect(signer);
    const result = await ENSTokenContract.delegate(address, {
      gasLimit: DELEGATE_GAS_LIMIT,
    });
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

export async function delegateBySig(
  address,
  setClaimState,
  history,
  nonce,
  walletProvider,
  chainId
) {
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // set expiry of signature to 7 days from now
  const message = {
    delegatee: address,
    nonce,
    expiry,
  };
  try {
    const provider = getEthersProvider(walletProvider);
    const signer = provider.getSigner();
    const chainId = network();
    const sig = await signer._signTypedData(
      {
        name: "Ethereum Name Service",
        version: "1",
        chainId: chainId,
        verifyingContract: getENSTokenContractAddress(chainId),
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

    const delegateSigResponseData = await sendToDelegateJsonRpc("delegate", {
      delegatee: address,
      nonce,
      expiry,
      r,
      s,
      v,
    });
    if (!delegateSigResponseData)
      throw new Error("Didn't get response from server");

    setClaimState({
      state: "QUEUED",
      message: delegateSigResponseData,
    });
    return delegateSigResponseData;
  } catch (error) {
    console.error(error);
    setClaimState({
      state: "ERROR",
      message: error,
    });
  }
}
