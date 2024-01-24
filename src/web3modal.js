import { ethers } from "ethers";

import { isConnected, network } from "./apollo";

export const rpcUrl = "https://web3.ens.domains/v1/mainnet";

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
