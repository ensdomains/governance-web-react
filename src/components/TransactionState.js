import React from "react";
import styled from "styled-components";

import LoadingIndicator from "../assets/imgs/LoadingIndicator.svg";
import WarningIndicator from "../assets/imgs/WarningIndicator.svg";
import GreenTickIndicator from "../assets/imgs/GreenTickIndicator.svg";

const Logo = styled.img`
  animation: ${(p) => {
    switch (p.type) {
      case "LOADING":
        return "rotation 2s infinite linear";
      default:
        return "initial";
    }
  }};

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const getLogoSrc = (type) => {
  switch (type) {
    case "LOADING":
      return LoadingIndicator;
    case "ERROR":
      return WarningIndicator;
    case "SUCCESS":
      return GreenTickIndicator;
    default:
      return "";
  }
};

const TransactionStateTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 141%;
  color: #1a1a1a;
`;

const TransactionStateContent = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 141%;

  color: #1a1a1a;
`;

const TransactionStateContainer = styled.div`
  display: flex;
`;

const TransactionContentContainer = styled.div`
  margin-left: 20px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransactionState = ({ transactionState, title, content }) => (
  <TransactionStateContainer>
    <LogoContainer>
      <Logo type={transactionState} src={getLogoSrc(transactionState)} />
    </LogoContainer>
    <TransactionContentContainer>
      <TransactionStateTitle>{title}</TransactionStateTitle>
      <TransactionStateContent>{content}</TransactionStateContent>
    </TransactionContentContainer>
  </TransactionStateContainer>
);

export default TransactionState;
