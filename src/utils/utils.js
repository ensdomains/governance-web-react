export const getEnv = () => window.location.href.includes('localhost') ? 'dev' : 'prod'

export const isDev = () => getEnv() === 'dev'

export const formatTokenAmount = (tokenAmount, length = 9) =>
    new Intl.NumberFormat(
        'en-US',
        {
            maximumFractionDigits: 2,
        }
    ).format(Number(tokenAmount) / Math.pow(10, 18))

export const getENSTokenContractAddress = () =>
    isDev()
        ? '0x87CE9B06Ae14F757FC591148E75970343B72a4fa'
        : '0x33071c57DE0660d61b638Fa533100Cdf94Ebd323'

export const generateMerkleShardUrl = (address) => `/airdrops/mainnet/${address?.slice(2, 4)}.json`

export const networkName = {
    main: 'mainnet',
    goerli: 'goerli',
    rinkeby: 'rinkeby',
    ropsten: 'ropsten',
    local: 'local'
}

const networkIdToName = (networkId) => {
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

export function imageUrl(url, name, networkId) {
    const _network = networkIdToName(networkId)
    const _protocol = supportedAvatarProtocols.find(proto =>
        url.startsWith(proto)
    )
    // check if given uri is supported
    // provided network name is valid,
    // domain name is available
    if (_protocol && _network && name) {
        return `https://metadata.ens.domains/${_network}/avatar/${name}`
    }
    console.warn('Unsupported avatar', _network, name, url)
}
