import React, { useEffect, useState } from 'react';

const getFirstNameRegistration = () => {

}

const getTotalTimeRegistered = () => {

}

const getNumberOfNamesRegistered = () => {

}

const getLastNameExpiry = () => {

}

const generateMerkleShardUrl = (address) => {
   return `/public/airdrops/mainnet/${address?.slice(2,4)}.json`
}

const useGetAddressDetails = (address) => {
    const [addressDetails, setAddressDetails] = useState(null)

    useEffect(() => {
        const run = async () => {
            const shard = await generateMerkleShardUrl(address)
        }

        if(address) {
           run()
        }
    }, [address])

    return addressDetails
}

const ClaimEnsToken = () => {
    const addressDetails = useGetAddressDetails('adddress')
    return (
        <div>

        </div>
    );
};

export default ClaimEnsToken;
