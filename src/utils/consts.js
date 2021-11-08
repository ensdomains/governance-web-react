export const PROPOSAL_ID = "0xd810c4cf2f09737a6f833f1ec51eaa5504cbc0afeeb883a21a7e1c91c8a597e4";
export const SPACE_ID = "ens.eth";
export const ALLOCATION_ENDPOINT =
  "https://us-central1-ens-manager.cloudfunctions.net/getvotes";

export const getEnv = () =>
  window.location.href.includes("localhost") ? "dev" : "prod";

export const isDev = () => getEnv() === "dev";

export const getENSTokenContractAddress = () =>
  isDev() ? "token.ensdao.eth" : "token.ensdao.eth";

export const getENSDelegateContractAddress = () =>
  isDev()
    ? "0x9c9Be865067d9acC5da6b73Fd48EAa3B6c382858"
    : "0x9c9Be865067d9acC5da6b73Fd48EAa3B6c382858";

export const getReverseRecordsAddress = () =>
  isDev()
    ? "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C"
    : "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C";

export const generateMerkleShardUrl = (address) =>
  `/airdrops/mainnet/${address?.slice(2, 4)}.json`;

export const networkName = {
  main: "mainnet",
  goerli: "goerli",
  rinkeby: "rinkeby",
  ropsten: "ropsten",
  local: "local",
};

export const networkIdToName = (networkId) => {
  switch (networkId) {
    case 1:
      return "mainnet";
    case 3:
      return "goerli";
    case 4:
      return "rinkeby";
    case 5:
      return "ropsten";
    case 1337:
      return "local";
    default:
      return "mainnet";
  }
};

export const supportedAvatarProtocols = [
  "http://",
  "https://",
  "ipfs://",
  "eip155",
  "Qm",
];
