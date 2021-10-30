import React, {useEffect, useState} from 'react';
import styled from 'styled-components'

import {getEthersProvider} from "../web3modal";
import {imageUrl} from "../utils/utils";

const ProfileContainer = styled.div`
  display: flex;
  max-width: ${p => p.large ? '350px' : '200px'};
  background: ${p => p.large ? 'initial' : '#FFFFFF'};
  box-shadow: ${p => p.large ? 'initial' : '0px 1px 20px rgba(0, 0, 0, 0.05)'};
  border-radius: 64px;
  padding: 8px 16px 8px 10px;
`

const RightContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const AvatarImg = styled.img`
  border-radius: 50%;
  width: ${p => p.large ? '60px' : '50px'};
  height: ${p => p.large ? '60px' : '50px'};
  min-width: ${p => p.large ? '60px' : '50px'};
  min-height: ${p => p.large ? '60px' : '50px'};
  margin-right: 10px;
`

const EmptyAvatar = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background: linear-gradient(157.05deg, #9FC6FF -5%, #256EDA 141.71%);
`

const EnsNameText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: ${p => p.large ? '30px' : '19px'};
  line-height: ${p => p.large ? '36px' : '23px'};
  letter-spacing: -0.01em;
`

const NoNameText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 21px;
  display: flex;
  align-items: center;
  letter-spacing: -0.01em;

  color: #323232;

  opacity: 0.3;
`

const AddressText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  color: #989898;

  ${p => p.large && `
      color: #989898;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
      color: #666666;
      opacity: 0.67;
      `
  }

  ${p => (p.large && !p.ensName) && `
        font-style: normal;
        font-weight: bold;
        font-size: 26px;
        line-height: 33px;
        color: #000000;
      `
  }
`

const Profile = ({address, large}) => {
    const [profileDetails, setProfileDetails] = useState({})

    useEffect(() => {
        const run = async () => {
            const ethersProvider = getEthersProvider()

            if (!ethersProvider) {
                console.error('no ethers provider')
                return;
            }

            const networkId = await ethersProvider.getNetwork()

            const ensName = await ethersProvider.lookupAddress(address)
            if (!ensName) return

            const resolver = await ethersProvider.getResolver(ensName)
            const avatar = await resolver.getText('avatar')

            setProfileDetails({
                ensName,
                avatar,
                networkId
            })
        }

        run().catch(e => {
            console.error(e)
        })
    }, [address])

    return (
        <ProfileContainer {...{large}}>
                {profileDetails.avatar
                    ? <AvatarImg
                        {...{large}}
                        src={imageUrl(
                            profileDetails.avatar,
                            profileDetails.ensName,
                            profileDetails.networkId
                        )}/>
                    : <EmptyAvatar/>
                }
            <RightContainer>
                {profileDetails.ensName
                    ? <EnsNameText {...{large}}>{profileDetails.ensName}</EnsNameText>
                    : <NoNameText>No name set</NoNameText>
                }
                <AddressText {...{large, ensName: profileDetails.ensName}}>{address}</AddressText>
            </RightContainer>
        </ProfileContainer>
    );
};

export default Profile;
