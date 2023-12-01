import React from "react";
import styled from "styled-components/macro";

import { CTAButton } from "./buttons";
import { largerThan } from "../utils/styledComponents";

const FooterContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  margin-top: ${(p) => (p.grid ? "-20px" : "0px")};

  ${largerThan.tablet`
        grid-column-start: 1;
        grid-column-end: 3;    
    `}
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  margin-right: 16px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  text-align: right;
  color: #000000;
  opacity: 0.3;
`;

const SubText = styled(Text)`
  opacity: 0.5;
  font-size: 14px;
`;

const TextAndSubText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

export const Footer = ({
  rightButtonText,
  rightButtonCallback,
  leftButtonText,
  leftButtonCallback,
  disabled,
  grid,
  text,
  subText,
}) => {
  return (
    <FooterContainer {...{ grid }}>
      {leftButtonText ? (
        <CTAButton
          text={leftButtonText}
          onClick={leftButtonCallback}
          type="deny"
        />
      ) : (
        <div></div>
      )}
      {rightButtonText ? (
        <RightContainer>
          {text && (
            <TextAndSubText>
              <Text>{text}</Text>
              {subText && <SubText>{subText}</SubText>}
            </TextAndSubText>
          )}
          <CTAButton
            data-testid="right-cta"
            text={rightButtonText}
            onClick={disabled ? () => null : rightButtonCallback}
            type={disabled ? "disabled" : ""}
          />
        </RightContainer>
      ) : (
        <div></div>
      )}
    </FooterContainer>
  );
};

export default Footer;
