import { ethers } from "ethers";
import { Bitski } from "bitski";

import {
  addressReactive,
  isConnected,
  addressDetails,
  network,
  ep2AddressDetails,
} from "./apollo";
import { getClaimData } from "./utils/utils";
import { initLocalStorage } from "./pages/ENSConstitution/constitutionHelpers";

export const rpcUrl = "https://web3.ens.domains/v1/mainnet";

const PORTIS_ID = "57e5d6ca-e408-4925-99c4-e7da3bdb8bf5";

let provider;
let web3Modal;
let ethersProvider;
let ensInstance;

const BITSKI_CLIENT_ID = "7a89f99f-8367-4821-86d8-124b059815f8";

const option = {
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: () => import("@walletconnect/web3-provider"),
      packageFactory: true,
      options: {
        rpc: {
          1: rpcUrl,
        },
      },
    },
    walletlink: {
      package: () => import("walletlink"),
      packageFactory: true,
      options: {
        appName: "Ethereum name service",
        jsonRpcUrl: rpcUrl,
      },
    },
    /* Remove until wrtc can be built on M1 mac, see: https://github.com/MyEtherWallet/MEWconnect-web-client/issues/75 */
    // mewconnect: {
    //   package: () => import("@myetherwallet/mewconnect-web-client"),
    //   packageFactory: true,
    //   options: {
    //     rpc: rpcUrl,
    //     description: " ",
    //   },
    // },
    portis: {
      package: () => import("@portis/web3"),
      packageFactory: true,
      options: {
        id: PORTIS_ID,
      },
    },
    torus: {
      package: () => import("@toruslabs/torus-embed"),
      packageFactory: true,
    },
    bitski: {
      package: Bitski, // required
      options: {
        clientId: BITSKI_CLIENT_ID, // required
        callbackUrl: window.location.href + "bitski-callback.html", // required
      },
    },
  },
};

export const connect = async (showPrompt) => {
  try {
    const Web3Modal = (await import("@ensdomains/web3modal")).default;
    web3Modal = new Web3Modal(option);
    const cachedProvider = web3Modal.cachedProvider;
    provider =
      cachedProvider && cachedProvider.length > 0
        ? await web3Modal.connectTo(cachedProvider)
        : showPrompt && (await web3Modal.connect());
    if (!provider) throw new Error("No provider found");
    return provider;
  } catch (e) {
    if (e && e !== "Modal closed by user") {
      throw e;
    }
  }
};

export const disconnect = async function () {
  if (web3Modal) {
    web3Modal.clearCachedProvider();
  }

  if (provider && provider.disconnect) {
    provider.disconnect();
  }
  // clear connection data and reconnect with infura
  ethersProvider = undefined;

  isConnected(false);
  addressReactive(null);
  network(null);
  addressDetails({});
  await initWeb3Read();
};

export const initWeb3Read = async () => {
  // if cache exists, try to connect. else use infura
  if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
    await initWeb3(false);
  }
  console.log(
    "initWeb3Read: ",
    localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")
  );

  if (!ethersProvider) {
    ethersProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    isConnected(true);
    const net = await ethersProvider.getNetwork();
    network(net.chainId);
  }
};

export const initWeb3 = async (showPrompt = true) => {
  //Need to get web3 provider
  if (showPrompt) {
  }
};

export const getProvider = () => provider;
export const getEthersProvider = () => ethersProvider;
export const getEnsInstance = () => ensInstance;
