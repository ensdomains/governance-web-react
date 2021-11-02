export const PROPOSAL_ID = "QmSEspbHEcD5o2MGNwjr4mj218CRwAimt1eXjLNcLP2CN6"

export const getEnv = () => window.location.href.includes('localhost') ? 'dev' : 'prod'

export const isDev = () => getEnv() === 'dev'

export const getENSTokenContractAddress = () =>
    isDev()
        ? '0xdFeA413b703Ba797b71B01eD9Fbc18F5d2eA639E'
        : '0xD20C465858df5fcAA4148e8fD849c0C35A6BD870'

export const getENSDelegateContractAddress = () =>
    isDev()
        ? '0x3b55763e582109eD4A15d6E12C9ac2D4dd2d0b96'
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
