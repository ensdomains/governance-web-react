import React from "react";
import styled from "styled-components";
import theme from "./theme";

const EtherscanBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(82, 152, 255, 0.2);
  padding: 15px 30px;
  border-radius: 12px;
`;

const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${theme.colors.blue};
  font-weight: bold;
  text-align: right;
`;

const MessageContainer = styled.p`
  margin: 0;
  font-weight: bold;
`;

const EtherscanBox = ({ transactionHash, message }) => (
  <EtherscanBoxContainer data-testid="etherscan-box">
    <MessageContainer>{message}</MessageContainer>
    <EtherscanLink href={`https://etherscan.io/tx/${transactionHash}`}>
      View on Etherscan
    </EtherscanLink>
  </EtherscanBoxContainer>
);

export default EtherscanBox;
