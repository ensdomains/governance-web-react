import { ethers } from "ethers";
import { Bitski } from "bitski";

import { isConnected, network } from "./apollo";

// export const rpcUrl = "https://web3.ens.domains/v1/mainnet";

export const rpcUrl =
  "https://mainnet.infura.io/v3/4d6e2605d0b1497fad8373ba11ddee8c";

let provider;
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

export const getProvider = () => provider;
export const getEthersProvider = () => ethersProvider;
export const getEnsInstance = () => ensInstance;
