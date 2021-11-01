import {ethers} from "ethers";

import {addressReactive, apolloClientInstance, isConnected, addressDetails} from "./apollo";
import {formatTokenAmount, generateMerkleShardUrl} from "./utils/utils";
import {gql} from "graphql-tag";

const INFURA_ID =
    window.location.host === 'app.ens.domains'
        ? '90f210707d3c450f847659dc9a3436ea'
        : '58a380d3ecd545b2b5b3dad5d2b18bf0'

const PORTIS_ID = '57e5d6ca-e408-4925-99c4-e7da3bdb8bf5'

let provider
let web3Modal
let ethersProvider
let ensInstance

const option = {
    network: 'mainnet', // optional
    cacheProvider: true, // optional
    providerOptions: {
        walletconnect: {
            package: () => import('@walletconnect/web3-provider'),
            packageFactory: true,
            options: {
                infuraId: INFURA_ID
            }
        },
        walletlink: {
            package: () => import('walletlink'),
            packageFactory: true,
            options: {
                appName: 'Ethereum name service',
                jsonRpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`
            }
        },
        mewconnect: {
            package: () => import('@myetherwallet/mewconnect-web-client'),
            packageFactory: true,
            options: {
                infuraId: INFURA_ID,
                description: ' '
            }
        },
        portis: {
            package: () => import('@portis/web3'),
            packageFactory: true,
            options: {
                id: PORTIS_ID
            }
        },
        torus: {
            package: () => import('@toruslabs/torus-embed'),
            packageFactory: true
        }
    }
}

export const connect = async () => {
    try {
        const Web3Modal = (await import('@ensdomains/web3modal')).default
        web3Modal = new Web3Modal(option)
        provider = await web3Modal.connect()

        return provider
    } catch (e) {
        if (e !== 'Modal closed by user') {
            throw e
        }
    }
}

export const disconnect = async function () {
    if (web3Modal) {
        await web3Modal.clearCachedProvider()
    }

    if (provider && provider.disconnect) {
        provider.disconnect()
    }
}

const LABELHASH_QUERY = gql`
    query domainByLabelhash($labelhash: [String]) {
        domains(where:{ labelhash_in: $labelhash }) {
            name
            labelhash
          }
}
`

const getClaimData = async (address) => {
    console.log('address: ', address)
    const response = await fetch(generateMerkleShardUrl(address))
    if (!response.ok) {
        throw new Error('error getting shard data')
    }
    const shardData = await response.json({encoding: 'utf-8'})
    const addressDetails = shardData?.entries[address]

    if(addressDetails) {
        const {data} = await apolloClientInstance
            .query({
                query: LABELHASH_QUERY,
                variables: {
                    labelhash: [addressDetails?.last_expiring_name, addressDetails?.longest_owned_name]
                }
            })

        const longestOwnedName = data
            ?.domains
            .find(x => x.labelhash === addressDetails?.longest_owned_name)
            ?.name
        const lastExpiringName = data
            ?.domains.find(x => x.labelhash === addressDetails?.last_expiring_name)
            ?.name
        const pastTokens = formatTokenAmount(addressDetails?.past_tokens, 2)
        const futureTokens = formatTokenAmount(addressDetails?.future_tokens, 2)
        const balance = formatTokenAmount(addressDetails?.balance)
        const shortBalance = formatTokenAmount(addressDetails?.balance, 2)

        return ({
            lastExpiringName,
            longestOwnedName,
            pastTokens,
            futureTokens,
            balance,
            shortBalance,
            hasReverseRecord: addressDetails?.has_reverse_record,
            rawBalance: addressDetails?.balance,
            eligible: true
        })
    }

    return ({
        eligible: false
    })
}

export const initWeb3 = async () => {
    const web3Provider = await connect();

    web3Provider?.on('chainChanged', async _chainId => {
        window.location.reload();
    })

    web3Provider?.on('accountsChanged', async accounts => {
        window.location.reload();
    })

    try {
        ethersProvider = new ethers.providers.Web3Provider(web3Provider)
    } catch (e) {
        console.error(e)
    }

    const signer = ethersProvider?.getSigner()
    let address;

    if (signer) {
        try {
            address = (await signer.getAddress()).toLowerCase()
        } catch (e) {
            console.error(e)
        }
    }

    if (address) {
        isConnected(true)
        addressReactive(address)
        const claimData = await getClaimData(address)
        console.log('claimData:', claimData)
        addressDetails(claimData)
        return
    }
    isConnected(false)
    addressReactive(null)
}

export const getProvider = () => provider
export const getEthersProvider = () => ethersProvider
export const getEnsInstance = () => ensInstance

