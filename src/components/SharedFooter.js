import React from 'react';
import styled from 'styled-components';

import {ReactComponent as TwitterGrey} from '../assets/imgs/TwitterGrey.svg'
import {ReactComponent as ThingGrey} from '../assets/imgs/ThingGrey.svg'
import {ReactComponent as DiscordGrey} from '../assets/imgs/DiscordGrey.svg'

const SharedFooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  pointer-events: none;
`

const LeftContainer = styled.div``

const RightContainer = styled.div`
  display: grid;
  gap: 15px;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
`

const InnerContainer = styled.div`
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const SharedFooter = () => {
    return (
        <SharedFooterContainer>
            <InnerContainer>
                <LeftContainer></LeftContainer>
                <RightContainer>
                    <a target={"_blank"} href={"https://twitter.com/ensdomains"}>
                        <TwitterGrey/>
                    </a>
                    <a target={"_blank"} href={""}>
                        <ThingGrey/>
                    </a>
                    <a target={"_blank"} href={"https://discord.gg/qDYkrFKAUW"}>
                        <DiscordGrey/>
                    </a>
                </RightContainer>
            </InnerContainer>
        </SharedFooterContainer>
    );
};

export default SharedFooter;