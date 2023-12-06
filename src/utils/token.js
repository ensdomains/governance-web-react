import { BigNumber, Contract, utils } from "ethers";
import { network } from "../apollo";
import SeamTokenAbi from "../assets/abis/Seam.json";
import SeamAirdrop from "../assets/abis/SeamAirdrop.json";
import MerkleAirdropAbi from "../assets/abis/MerkleAirdrop.json";
import ep2MerkleRoot from "../assets/root-ep2.json";
import merkleRoot from "../assets/root.json";
import ShardedMerkleTree, { getIndex } from "../merkle";
import { getEthersProvider } from "../web3modal";
import {
  DELEGATE_GAS_LIMIT,
  GAS_LIMIT,
  generateMerkleShardUrl,
  getENSTokenContractAddress,
  getMerkleAirdropContractAddress,
} from "./consts";
import { sendToDelegateJsonRpc } from "./utils";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import {parseUnits, solidityKeccak256 } from "ethers/lib/utils";
import { parse } from "path";
const merkleTreeData = require('../root.json'); 

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

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
        ? new Contract(SeamTokenAbi.address, SeamTokenAbi.abi, signer)
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

    const airdropContract = new Contract(SeamAirdrop.address, SeamAirdrop.abi, signer);
     airdropContract.connect(signer);

    const result = await airdropContract.claim(address,  BigNumber.from(balance), proof, { gasLimit: GAS_LIMIT });
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
    const SeamTokenContract = new Contract(
      SeamTokenAbi.address,
      SeamTokenAbi.abi,
      signer
    );
    SeamTokenContract.connect(signer);

    const seamDelegate = await SeamTokenContract.delegates(await signer.getAddress());
    if (seamDelegate === ZERO_ADDRESS) {
      const result = await SeamTokenContract.delegate(address, {
        gasLimit: DELEGATE_GAS_LIMIT,
      });
      await result.wait(1);
    }

    const EsSeamTokenContract = new Contract(
      EsSeamTokenAbi.address,
      EsSeamTokenAbi.abi,
      signer
    );
    EsSeamTokenContract.connect(signer);

    const esSeamDelegate = await EsSeamTokenContract.delegates(await signer.getAddress());
    if (esSeamDelegate === ZERO_ADDRESS) {
      const result = await EsSeamTokenContract.delegate(address, {
        gasLimit: DELEGATE_GAS_LIMIT,
      });
      await result.wait(1);
    }
    
    setClaimState({
      state: "SUCCESS",
      message: "",
    });
    return setTimeout(() => {
      history.push("/claim");
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
    const chainId = network();
    const sig = await signer._signTypedData(
      {
        name: "Seamless",
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

export const generateLeaf = (address, value) => {
  return Buffer.from(
    solidityKeccak256(["address", "uint256"], [address, value]).slice(2),
    "hex"
  );
};

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

    const leaves = Object.entries(merkleTreeData).map(([address, value]) => {
      return generateLeaf(address, parseUnits(value.toString(), 18).toString());
    });

    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const balance = parseUnits(
      merkleTreeData[address].toString(),
      18
    ).toString();
    const proof = merkleTree.getHexProof(
      generateLeaf(address, balance.toString())
    );

    return await submitClaim(
      balance,
      proof,
      address,
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
