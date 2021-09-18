import {ApolloClient, InMemoryCache, makeVar} from "@apollo/client";

export const addressReactive = makeVar(null)
export const isConnected = makeVar(false)

const typePolicies = {
    Query: {
        fields: {
            address: {
                read() {
                    return addressReactive()
                }
            },
            isConnected: {
                read() {
                    return isConnected()
                }
            }
        }
    }
}

export const initApolloClient = () => new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    cache: new InMemoryCache(typePolicies)
});
