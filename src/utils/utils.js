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
