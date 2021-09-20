import {ApolloClient, InMemoryCache, makeVar} from "@apollo/client";
import {gql} from "graphql-tag";

export const addressReactive = makeVar(null)
export const isConnected = makeVar(false)


const typePolicies = {
    Query: {
        fields: {
            isConnected: {
                read() {
                    return isConnected()
                }
            },
            address: {
                read() {
                    return addressReactive()
                }
            },
        }
    }
}

export const initApolloClient = () => new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    cache: new InMemoryCache({typePolicies})
});
