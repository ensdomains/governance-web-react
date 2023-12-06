import { ethers } from "ethers";

import {
  addressReactive,
  isConnected,
  addressDetails,
  network,
  ep2AddressDetails,
} from "./apollo";
import { getClaimData } from "./utils/utils";
import { initLocalStorage } from "./pages/ENSConstitution/constitutionHelpers";

export const rpcUrl =
  "https://rpc.tenderly.co/fork/c1626274-17a0-4b7e-9b8b-54a493cea145";

export const mainnetRpc =
  process.env.PRIVATE_RPC_URL || "https://eth.llamarpc.com";

//const PORTIS_ID = "57e5d6ca-e408-4925-99c4-e7da3bdb8bf5";

let provider;
let web3Modal;
let ethersProvider;
let ensInstance;

//const BITSKI_CLIENT_ID = "7a89f99f-8367-4821-86d8-124b059815f8";

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
        appName: "Seamless Protocol",
        jsonRpcUrl: rpcUrl,
      },
    },
    // mewconnect: {
    //   package: () => import("@myetherwallet/mewconnect-web-client"),
    //   packageFactory: true,
    //   options: {
    //     rpc: rpcUrl,
    //     description: " ",
    //   },
    // },
    // portis: {
    //   package: () => import("@portis/web3"),
    //   packageFactory: true,
    //   options: {
    //     id: PORTIS_ID,
    //   },
    // },
    // torus: {
    //   package: () => import("@toruslabs/torus-embed"),
    //   packageFactory: true,
    // },
    // bitski: {
    //   package: Bitski, // required
    //   options: {
    //     clientId: BITSKI_CLIENT_ID, // required
    //     callbackUrl: window.location.href + "bitski-callback.html", // required
    //   },
    // },
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
  ensInstance = undefined;

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
  if (!ethersProvider) {
    ethersProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    ensInstance = new ethers.providers.StaticJsonRpcProvider(mainnetRpc, 1);
    isConnected(true);
    const net = await ethersProvider.getNetwork();
    network(net.chainId);
  }
};

export const initWeb3 = async (showPrompt = true) => {
  // fix for web3 modal only showing walletconnect prompt if cached
  if (showPrompt) {
    const cached = localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER");
    const walletconnect = localStorage.getItem("walletconnect");
    if (
      cached &&
      cached === `"walletconnect"` &&
      (!walletconnect || !walletconnect.connected)
    ) {
      localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
    }
  }
  const web3Provider = await connect(showPrompt);

  web3Provider?.on("chainChanged", async (_chainId) => {
    window.location.reload();
  });

  web3Provider?.on("accountsChanged", async (accounts) => {
    window.location.reload();
  });

  try {
    ethersProvider = new ethers.providers.Web3Provider(web3Provider);
    ensInstance = new ethers.providers.StaticJsonRpcProvider(mainnetRpc, 1);
  } catch (e) {
    console.error(e);
  }

  const signer = ethersProvider?.getSigner();
  let address;

  if (signer) {
    try {
      address = (await signer.getAddress()).toLowerCase();
    } catch (e) {
      console.error(e);
    }
  }

  if (address) {
    initLocalStorage(address);
    isConnected(true);
    addressReactive(address);
    const net = await ethersProvider.getNetwork();
    network(net.chainId);
    const claimData = await getClaimData(address);
    addressDetails(claimData);
    const ep2ClaimData = await getClaimData(address, "ep2");
    ep2AddressDetails(ep2ClaimData);

    return;
  }
  isConnected(false);
  addressReactive(null);
};

export const getProvider = () => provider;
export const getEthersProvider = () => ethersProvider;
export const getEnsInstance = () => ensInstance;
