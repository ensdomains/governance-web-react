import React from "react";
import styled from "styled-components";
import theme from "./theme";

const SharedFooterContainer = styled.div`
  height: 56px;
  display: flex;
  justify-content: center;
  z-index: 1000;
  background-color: ${theme.colors.bg.headerFooter};
`;

const LeftContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  align-items: center;
`;

const RightContainer = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  width: 100%;
  height: 100%;
`;

const FooterLink = styled.a`
  font-size: 14px;
  color: white;
  cursor: pointer;

  @media screen and (max-width: 450px) {
    font-size: 10px;
  }
`;

const Image = styled.img`
  height: 24px;
  width: 24px;

  @media screen and (max-width: 450px) {
    height: 16px;
    width: 16px;
  }
`;

const FOOTER_LINKS = [
  {
    href: "https://seamlessprotocol.medium.com/seamless-protocol-terms-of-use-f9d75a855fb3",
    label: "Terms",
    key: "Terms",
  },
  {
    href: "https://seamlessprotocol.medium.com/seamless-privacy-policy-2ebfda169143",
    label: "Privacy",
    key: "Privacy",
  },
  {
    href: "https://docs.seamlessprotocol.com/overview/introduction-to-seamless-protocol",
    label: "Docs",
    key: "Docs",
  },
  {
    href: "https://docs.seamlessprotocol.com/overview/faq",
    label: "FAQ",
    key: "FAQ",
  },
  {
    href: "https://bridge.base.org/",
    label: "Base Bridge",
    key: "Bridge",
  },
];

const FOOTER_ICONS = [
  {
    href: "https://t.me/seamless_protocol",
    icon: "telegram.svg",
    title: "Telegram",
  },
  {
    href: "https://discord.gg/urQPJu3CKt",
    icon: "discord.svg",
    title: "Discord",
  },
  {
    href: "https://twitter.com/seamlessfi",
    icon: "twitter.svg",
    title: "Twitter",
  },
  {
    href: "https://github.com/seamless-protocol/",
    icon: "gh.svg",
    title: "Github",
  },
];

const SharedFooter = () => {
  return (
    <SharedFooterContainer>
      <InnerContainer>
        <LeftContainer>
          {FOOTER_LINKS.map((link) => (
            <FooterLink
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </FooterLink>
          ))}
        </LeftContainer>
        <RightContainer>
          {FOOTER_ICONS.map((icon) => (
            <FooterLink
              href={icon.href}
              key={icon.title}
              target="_blank"
              rel="noreferrer"
            >
              <Image src={icon.icon} alt="link logos" />
            </FooterLink>
          ))}
        </RightContainer>
      </InnerContainer>
    </SharedFooterContainer>
  );
};

export default SharedFooter;
