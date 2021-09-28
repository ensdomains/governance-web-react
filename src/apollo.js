import {ApolloClient, InMemoryCache, makeVar} from "@apollo/client";

export const addressReactive = makeVar(null)
export const isConnected = makeVar(false)
export const addressDetails = makeVar({})

export let apolloClientInstance

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
                    return addressReactive() ? addressReactive().toLowerCase() : addressReactive()
                }
            },
            addressDetails: {
                read() {
                    return addressDetails()
                }
            },
        }
    }
}

export const initApolloClient = () => {
    apolloClientInstance = new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
        cache: new InMemoryCache({typePolicies})
    })
    return apolloClientInstance
};
