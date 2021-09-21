import {ethers} from "ethers";
import {setupENS} from '@ensdomains/ui'

import {addressReactive, isConnected} from "./apollo";
import {getEnv} from "./utils/utils";

const INFURA_ID =
    window.location.host === 'app.ens.domains'
        ? '90f210707d3c450f847659dc9a3436ea'
        : '58a380d3ecd545b2b5b3dad5d2b18bf0'

const PORTIS_ID = '57e5d6ca-e408-4925-99c4-e7da3bdb8bf5'

let provider
let web3Modal
let ensInstance
let ethersProvider
let jsonRpcProvider

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

export const initWeb3 = async () => {
    const web3Provider = await connect();

    try {
        if(getEnv() === 'dev') {
            jsonRpcProvider = new ethers.providers.JsonRpcProvider();
        }
        ethersProvider = new ethers.providers.Web3Provider(web3Provider)

    } catch (e) {
    }

    const signer = ethersProvider?.getSigner()
    let address;

    if (signer) {
        try {
            address = await signer.getAddress()
        } catch (e) {
        }
    }

    if (address) {
        isConnected(true)
        addressReactive(address)
        return
    }
    isConnected(false)
    addressReactive(null)

    if (ethersProvider) {
        ensInstance = await setupENS({
            customProvider: ethersProvider
        })
    }
}

export const getProvider = () => provider
export const getEnsInstance = () => ensInstance
export const getEthersProvider = () => ethersProvider
export const getJsonRpcProvider = () => jsonRpcProvider
