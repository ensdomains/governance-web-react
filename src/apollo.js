import {ApolloClient, InMemoryCache, makeVar} from "@apollo/client";

const addressReactive = makeVar(null)

const typePolicies = {
    Query: {
        fields: {
            address: {
                read() {
                    return addressReactive()
                }
            }
        }
    }
}

export const initApolloClient = () => new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    cache: new InMemoryCache(typePolicies)
});
