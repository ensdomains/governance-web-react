import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { utils } from "ethers";
import { useDisconnect, useWeb3ModalProvider } from "@web3modal/ethers5/react";

import { getEthersProvider } from "../web3modal";
import { imageUrl, shortenAddress } from "../utils/utils";
import GradientAvatar from "../assets/imgs/Gradient.svg";
import { ReactComponent as ProfileArrow } from "../assets/imgs/ProfileArrow.svg";
import DropdownWrapper from "./Dropdown";

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 16px 8px 10px;
  z-index: 10;
  box-shadow: ${(p) =>
    p.large ? "initial" : "0px 1px 20px rgba(0, 0, 0, 0.05)"};
  ${(p) => {
    switch (p.size) {
      case "large":
        return `
          background: initial;
          max-width: 350px;
        `;
      case "medium":
        return `
        background: white;
        max-width: 220px;
      `;
      case "small":
        return `
        background: transparent;
        max-width: 200px;
        padding: 0;
        box-shadow: none;
      `;
    }
  }}

  ${(p) =>
    p.hasDropdown &&
    `
    transition: all 0.2s ease-out;
    cursor: pointer;
  `}

  ${(p) =>
    p.dropdownOpen &&
    `
    box-shadow: none;
    background: #E8E8E8; 
  `}

  border-radius: 64px;
`;

const RightContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 112px;

  div {
    overflow: hidden;
  }
`;

const AvatarImg = styled.img`
  border-radius: 50%;
  background: linear-gradient(157.05deg, #9fc6ff -5%, #256eda 141.71%);

  ${(p) => {
    switch (p.size) {
      case "large":
        return `
          width: 60px;
          height: 60px;
          min-width: 60px;
          min-height: 60px
      `;
      case "medium":
        return `
          width: 50px;
          height: 50px;
          min-width: 50px;
          min-height: 50px
      `;
      case "small":
        return `
          width: 35px;
          height: 35px;
          min-width: 35px;
          min-height: 35px;
      `;

      default:
        return `
          width: 50px;
          height: 50px;
          min-width: 50px;
          min-height: 50px
      `;
    }
  }};
  margin-right: 10px;
`;

const EmptyAvatar = styled.div`
  border-radius: 50%;
  min-width: 50px;
  height: 50px;
  width: ${(p) => p.size === "large" && "60px"};
  height: ${(p) => p.size === "large" && "60px"};
  margin-right: 10px;
  background: linear-gradient(157.05deg, #9fc6ff -5%, #256eda 141.71%);
`;

const EnsNameText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: ${(p) => (p.size === "large" ? "26px" : "18px")};
  line-height: ${(p) => (p.size === "large" ? "36px" : "23px")};
  letter-spacing: -0.01em;
  margin-top: -2px;
  padding-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

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
`;

const AddressText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  color: #989898;

  ${(p) =>
    p.size === "large" &&
    `
      color: #989898;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
      color: #666666;
      opacity: 0.67;
      `}

  ${(p) =>
    p.size === "large" &&
    !p.ensName &&
    `
        font-style: normal;
        font-weight: bold;
        font-size: 26px;
        line-height: 33px;
        color: #000000;
      `}
`;

// function prop needed to stop hasOpened being passed to SVG
const StyledProfileArrow = styled(ProfileArrow)(({ hasOpened }) => ({
  transform: hasOpened ? "rotate(0deg)" : "rotate(180deg)",
  opacity: hasOpened ? 1 : 0.3,
  width: "12px",
  marginLeft: "12px",
  transition: "all 0.2s ease-out",
}));

const Profile = ({ address, size, hasDropdown }) => {
  const [profileDetails, setProfileDetails] = useState({});
  const [navOpen, setNavOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider();
  let isAddress;
  try {
    isAddress = utils.getAddress(address);
  } catch {
    isAddress = false;
  }

  useEffect(() => {
    const run = async () => {
      const ethersProvider = getEthersProvider(walletProvider);

      if (!ethersProvider) {
        console.error("no ethers provider");
        return;
      }

      const networkId = await ethersProvider.getNetwork();
      let ensName;
      if (!isAddress) {
        ensName = address;
      } else {
        ensName = await ethersProvider.lookupAddress(address);
      }
      if (!ensName) return;

      const resolver = await ethersProvider.getResolver(ensName);
      const avatar = await resolver.getText("avatar");

      setProfileDetails({
        ensName,
        avatar,
        networkId,
      });
    };

    run().catch((e) => {
      console.error(e);
    });
  }, [address]);

  if (size === "small") {
    return (
      <ProfileContainer size={size}>
        {profileDetails.avatar ? (
          <AvatarImg
            {...{ size }}
            key={profileDetails.avatar}
            src={imageUrl(
              profileDetails.avatar,
              profileDetails.ensName,
              profileDetails.networkId
            )}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = GradientAvatar;
            }}
          />
        ) : (
          <EmptyAvatar size={size} />
        )}
        <RightContainer>
          {profileDetails.ensName ? (
            <EnsNameText {...{ size }}>{profileDetails.ensName}</EnsNameText>
          ) : (
            <NoNameText>No name set</NoNameText>
          )}
          <AddressText
            {...{
              size,
              ensName: profileDetails.ensName,
            }}
          >
            {isAddress &&
              address &&
              shortenAddress(
                address,
                size === "large" ? 30 : 10,
                size === "large" ? 10 : 5,
                size === "large" ? 10 : 5
              )}
          </AddressText>
        </RightContainer>
      </ProfileContainer>
    );
  }

  return (
    <DropdownWrapper
      dropdownItems={[{ name: "Disconnect", type: "deny", action: disconnect }]}
      isOpen={navOpen}
      setIsOpen={setNavOpen}
      testId="profile-dropdown"
    >
      <ProfileContainer
        size={size}
        hasDropdown={hasDropdown}
        dropdownOpen={navOpen}
        onClick={() => setNavOpen(!navOpen)}
      >
        {profileDetails.avatar ? (
          <AvatarImg
            size={size}
            src={imageUrl(
              profileDetails.avatar,
              profileDetails.ensName,
              profileDetails.networkId
            )}
          />
        ) : (
          <EmptyAvatar size={size} />
        )}
        <RightContainer>
          {profileDetails.ensName ? (
            <EnsNameText size={size}>{profileDetails.ensName}</EnsNameText>
          ) : (
            <NoNameText>No name set</NoNameText>
          )}
          <AddressText size={size} ensName={profileDetails.ensName}>
            {isAddress &&
              address &&
              shortenAddress(
                address,
                size === "large" ? 30 : 10,
                size === "large" ? 10 : 5,
                size === "large" ? 10 : 5
              )}
          </AddressText>
        </RightContainer>
        {hasDropdown && <StyledProfileArrow hasOpened={navOpen} />}
      </ProfileContainer>
    </DropdownWrapper>
  );
};

export default Profile;
