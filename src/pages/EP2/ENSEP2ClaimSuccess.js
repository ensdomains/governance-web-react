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

const TWITTER_INTENT = encodeURIComponent(
  "SEAM is decentralizing governance!\n\nSeamless is an open public borrowing and lending protocol owned by the community.\n\n🎥 Check out the video: https://www.youtube.com/watch?v=yH3hre0uryU\n\nI’m a SEAM holder and just claimed my $SEAM governance tokens. Claim yours 👇\n\nclaim.seamlessprotocol.com"
);

const SocialButton = ({ type, text }) => {
  return (
    <a
      href={
        type === "Twitter"
          ? `https://twitter.com/intent/tweet?text=${TWITTER_INTENT}`
          : "https://discord.gg/urQPJu3CKt"
      }
      target={"_blank"}
      rel="noreferrer"
    >
      <SocialButtonContainer type={type}>
        <div>{text}</div>
        <img
          src={type === "Twitter" ? TwitterLogo : DiscordLogo}
          alt="social media logos"
        />
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
            Congratulations on claiming your <Token />!
          </Content>
          <Gap height={6} />
          <Content>
            We encourage you to share on Twitter and join the Seamless Discord
            to get involved in governance.
          </Content>
          <Gap height={8} />
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
