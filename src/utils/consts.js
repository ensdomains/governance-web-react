export const PROPOSAL_ID = "QmSEspbHEcD5o2MGNwjr4mj218CRwAimt1eXjLNcLP2CN6"

export const getEnv = () => window.location.href.includes('localhost') ? 'dev' : 'prod'

export const isDev = () => getEnv() === 'dev'

export const getENSTokenContractAddress = () =>
    isDev()
        ? '0xf99913EaC369E6757df695e875A4b18f942b8885'
        : '0x33071c57DE0660d61b638Fa533100Cdf94Ebd323'

export const getENSDelegateContractAddress = () =>
    isDev()
        ? '0x49662055A9bB779Fa86694DC2ec041D0cF602472'
        : '0xd8A54d061BdBB8A1EEFD68d437470B9aBF294c24'

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
