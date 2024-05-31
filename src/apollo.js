import { ApolloClient, HttpLink, InMemoryCache, makeVar } from "@apollo/client";

export const addressReactive = makeVar(null);
export const isConnected = makeVar(false);
export const addressDetails = makeVar({});
export const ep2AddressDetails = makeVar({});
export const signedVote = makeVar(null);
export const hasClaimed = makeVar(false);
export const ep2HasClaimed = makeVar(false);
export const network = makeVar(null);
export const delegates = makeVar({});
export const delegatedTo = makeVar({});
export const delegateSigDetails = makeVar({});
export const tokensOwned = makeVar({});
export const selectedDelegateReactive = makeVar({ address: null, name: null });

export let apolloClientInstance;

const typePolicies = {
  Query: {
    fields: {
      isConnected: {
        read() {
          return isConnected();
        },
      },
      address: {
        read() {
          return addressReactive()
            ? addressReactive().toLowerCase()
            : addressReactive();
        },
      },
      addressDetails: {
        read() {
          return addressDetails();
        },
      },
      ep2AddressDetails: {
        read() {
          return ep2AddressDetails();
        },
      },
      signedVote: {
        read() {
          return signedVote();
        },
      },
      network: {
        read() {
          return network();
        },
      },
      hasClaimed: {
        read() {
          return hasClaimed();
        },
      },
      ep2HasClaimed: {
        read() {
          return ep2HasClaimed();
        },
      },
      delegates: {
        read() {
          return delegates();
        },
      },
      tokensOwned: {
        read() {
          return tokensOwned();
        },
      },
      delegatedTo: {
        read() {
          return delegatedTo();
        },
      },
      delegateSigDetails: {
        read() {
          return delegateSigDetails();
        },
      },
      selectedDelegate: {
        read() {
          return selectedDelegateReactive();
        },
      },
    },
  },
};

const ENS_GRAPH_API_KEY = '13ef776c0372f7c14eb7c019a0f80272'

const getGraphqlUri = (operation) => {
  const { operationName } = operation;
  if (operationName === "Votes") {
    return "https://hub.snapshot.org/graphql";
  }
  return `https://gateway-arbitrum.network.thegraph.com/api/${ENS_GRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`;
};

export const initApolloClient = () => {
  apolloClientInstance = new ApolloClient({
    link: new HttpLink({
      uri: getGraphqlUri,
    }),
    cache: new InMemoryCache({ typePolicies }),
  });
  return apolloClientInstance;
};
