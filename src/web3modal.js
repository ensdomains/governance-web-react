import { ethers } from "ethers";
import { Bitski } from "bitski";

import {
  addressReactive,
  apolloClientInstance,
  isConnected,
  addressDetails,
  network,
} from "./apollo";
import { getClaimData } from "./utils/utils";
import { initLocalStorage } from "./pages/ENSConstitution/constitutionHelpers";

const INFURA_ID =
  window.location.host === "app.ens.domains"
    ? "90f210707d3c450f847659dc9a3436ea"
    : "58a380d3ecd545b2b5b3dad5d2b18bf0";

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
        infuraId: INFURA_ID,
      },
    },
    walletlink: {
      package: () => import("walletlink"),
      packageFactory: true,
      options: {
        appName: "Ethereum name service",
        jsonRpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      },
    },
    mewconnect: {
      package: () => import("@myetherwallet/mewconnect-web-client"),
      packageFactory: true,
      options: {
        rpc: `https://mainnet.infura.io/v3/${INFURA_ID}`,
        description: " ",
      },
    },
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

export const connect = async () => {
  try {
    const Web3Modal = (await import("@ensdomains/web3modal")).default;
    web3Modal = new Web3Modal(option);
    provider = await web3Modal.connect();

    return provider;
  } catch (e) {
    if (e !== "Modal closed by user") {
      throw e;
    }
  }
};

export const disconnect = async function () {
  if (web3Modal) {
    await web3Modal.clearCachedProvider();
  }

  if (provider && provider.disconnect) {
    provider.disconnect();
  }
};

export const initWeb3Read = async () => {
  ethersProvider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${INFURA_ID}`
  );
  console.log("init web3read");
  isConnected(true);
  const net = await ethersProvider.getNetwork();
  network(net.chainId);
};

export const initWeb3 = async () => {
  try {
    const web3Provider = await connect();
    console.log("after connected");

    web3Provider?.on("chainChanged", async (_chainId) => {
      window.location.reload();
    });

    web3Provider?.on("accountsChanged", async (accounts) => {
      window.location.reload();
    });

    try {
      console.log("web3 provider", web3Provider);
      ethersProvider = new ethers.providers.Web3Provider(web3Provider);
    } catch (e) {
      console.log(e);
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

    console.log(address);

    if (address) {
      initLocalStorage(address);
      isConnected(true);
      addressReactive(address);
      const net = await ethersProvider.getNetwork();
      network(net.chainId);
      // hasClaimed(address)
      const claimData = await getClaimData(address);
      addressDetails(claimData);

      return;
    }
    isConnected(false);
    addressReactive(null);
  } catch (e) {
    console.log("not connected");
  }
};

export const getProvider = () => provider;
export const getEthersProvider = () => ethersProvider;
export const getEnsInstance = () => ensInstance;
