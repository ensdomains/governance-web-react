import React from "react";
import styled from "styled-components/macro";

import theme from "./theme";

const ButtonContainer = styled.div`
  background: ${(p) => {
    switch (p.type) {
      case "approve":
        return theme.colors.green;
      case "reject":
        return theme.colors.red;
      case "deny":
        return theme.colors.grey;
      case "disabled":
        return "#E4E7EB";
      default:
        return "linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)";
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  color: ${(p) => {
    switch (p.type) {
      case "deny":
        return "#63666A";
      case "disabled":
        return "#ACAEB0";
      default:
        return "white";
    }
  }};
  padding: 14px 16px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.01em;
  transition: all 0.2s ease-out;
  cursor: ${(p) => {
    switch (p.type) {
      case "deny":
        return "pointer";
      case "disabled":
        return "not-allowed";
      default:
        return "pointer";
    }
  }};
  pointer-events: ${p => p.type === 'disabled' ? 'none' : 'initial'};
  user-select: none;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0px);
    filter: brightness(1);
  }
`;

export const CTAButton = (props) => {
  return <ButtonContainer disabled={props.type === 'disabled'} {...props}>{props.text}</ButtonContainer>;
};
