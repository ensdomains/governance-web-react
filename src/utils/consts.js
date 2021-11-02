export const PROPOSAL_ID = "QmQ4m6hVGawbo2cjVVUQx2Noz4mXJekMYxDrmg4ZN5GCXq"
export const SPACE_ID = "bananana.eth"

export const getEnv = () => window.location.href.includes('localhost') ? 'dev' : 'prod'

export const isDev = () => getEnv() === 'dev'

export const getENSTokenContractAddress = () =>
    isDev()
        ? '0x2530558EE2F806360a504e40334d269249944842'
        : '0xD20C465858df5fcAA4148e8fD849c0C35A6BD870'

export const getENSDelegateContractAddress = () =>
    isDev()
        ? '0x5b9116cFfb79A4449FC9ed198803127023e706BF'
        : '0x5aD2d6518fb50C752348563929b6796aa2a9b217'

export const generateMerkleShardUrl = (address) => `/airdrops/mainnet/${address?.slice(2, 4)}.json`

export const networkName = {
    main: 'mainnet',
    goerli: 'goerli',
    rinkeby: 'rinkeby',
    ropsten: 'ropsten',
    local: 'local'
}

export const networkIdToName = (networkId) => {
    switch (networkId) {
        case 1:
            return 'mainnet'
        case 3:
            return 'goerli'
        case 4:
            return 'rinkeby'
        case 5:
            return 'ropsten'
        case 1337:
            return 'local'
        default:
            return 'mainnet'
    }
}

export const supportedAvatarProtocols = [
    'http://',
    'https://',
    'ipfs://',
    'eip155'
]
