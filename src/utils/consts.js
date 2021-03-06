export const PROPOSAL_ID =
  "0xd810c4cf2f09737a6f833f1ec51eaa5504cbc0afeeb883a21a7e1c91c8a597e4";
export const SPACE_ID = "ens.eth";
export const ALLOCATION_ENDPOINT =
  "https://us-central1-ens-manager.cloudfunctions.net/getvotes";
export const GAS_LIMIT = 200000;
export const DELEGATE_GAS_LIMIT = 113000;
export const SNAPSHOT_TIMEOUT = 90000;

export const getENSTokenContractAddress = () =>
  "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72";

export const getENSDelegateContractAddress = () =>
  "0x9c9Be865067d9acC5da6b73Fd48EAa3B6c382858";

export const getReverseRecordsAddress = () =>
  "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C";

export const getMerkleAirdropContractAddress = () =>
  "0x4A1241C2Cf2fD4a39918BCd738f90Bd7094eC2DC";

export const generateMerkleShardUrl = (address, type = "mainnet") =>
  `/airdrops/${
    type !== "mainnet" && process.env.REACT_APP_STAGE === "testing"
      ? "testing"
      : type
  }/${address?.slice(2, type === "mainnet" ? 4 : 3)}.json`;

export const emptyAddress = "0x0000000000000000000000000000000000000000";

export const getDelegateRpcURL = () =>
  "https://us-central1-ens-delegator.cloudfunctions.net/delegate";

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
