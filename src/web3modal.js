import { ethers } from "ethers";

import { isConnected, network } from "./apollo";

export const rpcUrl =
  "https://mainnet.infura.io/v3/4d6e2605d0b1497fad8373ba11ddee8c";

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
