export const PROPOSAL_ID = "QmQ4m6hVGawbo2cjVVUQx2Noz4mXJekMYxDrmg4ZN5GCXq";
export const SPACE_ID = "bananana.eth";
export const ALLOCATION_ENDPOINT = "https://us-central1-ens-manager.cloudfunctions.net/getvotes";

export const getEnv = () =>
  window.location.href.includes("localhost") ? "dev" : "prod";

export const isDev = () => getEnv() === "dev";

export const getENSTokenContractAddress = () =>
  isDev()
    ? "0x901C31DdFC2fbE1C2b04cCc84a085fD9c78F75CB"
    : "0x8CaEa57F245B44df50439479efA1CB105ba0dacd";

export const getENSDelegateContractAddress = () =>
  isDev()
    ? "0x6af1a196636723E3D4B550a23a4CcFd71F8F6697"
    : "0xFF221090d773d7A5670B89d944F8cB298333E8BE";

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
];
