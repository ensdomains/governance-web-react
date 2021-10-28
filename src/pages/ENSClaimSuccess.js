import React from 'react';
import styled from 'styled-components';
import {Client} from "@snapshot-labs/snapshot.js";

import Footer from '../components/Footer'
import {Content, Header} from '../components/text'
import {ContentBox, NarrowColumn} from "../components/layout";
import Gap from "../components/Gap";
import {useHistory} from "react-router-dom";
import {CTAButton} from "../components/buttons";
import TwitterLogo from '../assets/imgs/Twitter.svg'
import DiscordLogo from '../assets/imgs/Discord.svg'

const SocialButtonContainer = styled.div`
  background: ${p => p.type === 'Twitter' ? '#EBF3FF' : '#F3EFFF'};
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
  color: ${p => p.type === 'Twitter' ? '#4D90F1' : '#854BFF'};
  cursor: pointer;
`

const SocialButton = ({type, text}) => {
    return (
        <a
            href={type === 'Twitter' ? 'https://twitter.com/intent/tweet' : 'https://discord.gg/qDYkrFKAUW'}
            target={"_blank"}
        >
            <SocialButtonContainer type={type}>
                <div>{text}</div>
                <img src={type === 'Twitter' ? TwitterLogo : DiscordLogo} />
            </SocialButtonContainer>
        </a>
    )
}

const ENSClaimSuccess = () => {
    const history = useHistory();

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Claim successful!</Header>
                <Gap height={3}/>
                <Content>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In semper orci in dolor laoreet hendrerit.
                    Duis rutrum eu magna non gravida. Vestibulum pulvinar ante eu tortor malesuada consectetur.
                </Content>
                <Gap height={3}/>
                <SocialButton type={"Twitter"} text={"Share on Twitter"}/>
                <Gap height={3} />
                <SocialButton type={"Discord"} text={"Join the Discord"}/>
                <Gap height={3}/>
                <CTAButton
                    onClick={() => {
                        history.push('/claim')
                    }}
                    text={"Return to dashboard"}
                    type={"deny"}
                />
            </ContentBox>
            <Footer
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/summary')
                }}
            />
        </NarrowColumn>
    );
};

export default ENSClaimSuccess;