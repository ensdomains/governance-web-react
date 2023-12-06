import React from "react";
import styled from "styled-components/macro";
import { useHistory } from "react-router-dom";

import Footer from "../components/Footer";
import Gap from "../components/Gap";
import { Header, Content } from "../components/text";
import { NarrowColumn } from "../components/layout";
import { ContentBox } from "../components/layout";

const WrappedNarrowColumn = styled(NarrowColumn)`
  max-width: 670px;
`;

const VideoEmbed = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 25px;
  height: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
  }
`;

const ENSGovernance = () => {
  const history = useHistory();

  return (
    <WrappedNarrowColumn>
      <ContentBox>
        <VideoEmbed>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/yH3hre0uryU?si=ocrt_VXLVqF5v3ae&amp;controls=0"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </VideoEmbed>
        <Gap height={5} />
        <Header>Why did I earn these tokens?</Header>
        <Gap height={3} />
        <Content>
          These initial SEAM tokens were rewarded to contributors and supporters
          of Seamless Protocol, rewarding the community for a diverse set of
          activities, including (but not limited to) supplying & borrowing on
          Seamless to creating content about Seamless on social media to
          completing quests & collecting NFTs to participating in other
          like-minded DeFi ecosystems.
        </Content>
        <Gap height={3} />
        <Content>
          Seamless Protocol is able to be where it is today because of the time
          committed & work that was put in by the entire community. Even this
          hype video was made by the community!
        </Content>
        <Gap height={3} />
      </ContentBox>
      <Footer
        rightButtonText="Next"
        rightButtonCallback={() => {
          history.push("/sign");
        }}
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/why");
        }}
      />
    </WrappedNarrowColumn>
  );
};

export default ENSGovernance;
