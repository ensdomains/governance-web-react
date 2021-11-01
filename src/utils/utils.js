import {networkIdToName, supportedAvatarProtocols} from "./consts";

export const formatTokenAmount = (tokenAmount, length = 6) =>
    new Intl.NumberFormat(
        'en-US',
        {
            minimumFractionDigits: length,
            maximumFractionDigits: length,
        }
    ).format(Number(tokenAmount) / Math.pow(10, 18))

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

export const shortenAddress = (
    address = '',
    maxLength = 10,
    leftSlice = 5,
    rightSlice = 5
) => {
    if (address.length < maxLength) {
        return address;
    }

    return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`;
}
