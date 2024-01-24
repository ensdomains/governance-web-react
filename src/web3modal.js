import { ethers } from "ethers";

import { isConnected, network } from "./apollo";

export const rpcUrl = "https://web3.ens.domains/v1/mainnet";

// export const rpcUrl =
//   "https://mainnet.infura.io/v3/4d6e2605d0b1497fad8373ba11ddee8c";

// export const rpcUrl =
//   "https://rpc.tenderly.co/fork/c7c153cc-f1e0-4256-8187-da989a61a138";

let ethersProvider;
let ensInstance;

export const initWeb3Read = async () => {
  if (!ethersProvider) {
    ethersProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    isConnected(true);
    const net = await ethersProvider.getNetwork();
    network(net.chainId);
  }
};

export const getEthersProvider = (walletProvider) =>
  walletProvider
    ? new ethers.providers.Web3Provider(walletProvider)
    : ethersProvider;
export const getEnsInstance = () => ensInstance;
