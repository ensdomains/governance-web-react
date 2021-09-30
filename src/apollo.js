import {ApolloClient, HttpLink, InMemoryCache, makeVar} from "@apollo/client";

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

const getGraphqlUri = (operation) => {
    const { operationName } = operation
    console.log('operationName: ', operationName)
    if(operationName === 'Votes') {
        return 'https://hub.snapshot.org/graphql'
    }
    return 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';
}

export const initApolloClient = () => {
    apolloClientInstance = new ApolloClient({
        link: new HttpLink({
            uri: getGraphqlUri
        }),
        cache: new InMemoryCache({typePolicies})
    })
    return apolloClientInstance
};
