import React from "react";
import styled from "styled-components";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import { Content, Header } from "../../components/text";
import { ContentBox, NarrowColumn } from "../../components/layout";
import Gap from "../../components/Gap";
import { useHistory } from "react-router-dom";
import { CTAButton } from "../../components/buttons";
import TwitterLogo from "../../assets/imgs/Twitter.svg";
import DiscordLogo from "../../assets/imgs/Discord.svg";
import Token from "../../components/Token";

const Confet = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} style={{ zIndex: "-2" }} />;
};

const SocialButtonContainer = styled.div`
  background: ${(p) => (p.type === "Twitter" ? "#EBF3FF" : "#F3EFFF")};
  border-radius: 14px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: -0.01em;
  color: ${(p) => (p.type === "Twitter" ? "#4D90F1" : "#854BFF")};
  cursor: pointer;
`;

const TWITTER_INTENT =
  "ENS%20is%20decentralizing%20governance%20with%20the%20%23ENSDAO!%20%40ensdomains%20is%20an%20open%20public%20identity%20protocol%20owned%20by%20the%20community.%0A%0AI%E2%80%99m%20an%20ENS%20.eth%20name%20holder%20and%20just%20claimed%20my%20%24ENS%20governance%20tokens.%20Claim%20yours%20%F0%9F%91%87%0A%0Aclaim.ens.domains";

const SocialButton = ({ type, text }) => {
  return (
    <a
      href={
        type === "Twitter"
          ? `https://twitter.com/intent/tweet?text=${TWITTER_INTENT}`
          : "https://chat.ens.domains/"
      }
      target={"_blank"}
    >
      <SocialButtonContainer type={type}>
        <div>{text}</div>
        <img src={type === "Twitter" ? TwitterLogo : DiscordLogo} />
      </SocialButtonContainer>
    </a>
  );
};

const ENSEP2ClaimSuccess = () => {
  const history = useHistory();

  return (
    <>
      <Confet />
      <NarrowColumn>
        <ContentBox>
          <Header>Claim successful!</Header>
          <Gap height={3} />
          <Content>
            Congratulations on claiming your <Token />! We encourage you to
            share on Twitter and join the ENS Discord to get involved in
            governance.
          </Content>
          <Gap height={10} />
          <SocialButton type={"Twitter"} text={"Share on Twitter"} />
          <Gap height={3} />
          <SocialButton type={"Discord"} text={"Join the Discord"} />
          <Gap height={3} />
          <CTAButton
            onClick={() => {
              history.push("/dashboard");
            }}
            text={"Return to dashboard"}
            type={"deny"}
          />
        </ContentBox>
      </NarrowColumn>
    </>
  );
};

export default ENSEP2ClaimSuccess;
