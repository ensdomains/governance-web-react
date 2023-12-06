import styled from "styled-components";
import { ReactComponent as SeamlessLogo } from "../assets/imgs/SeamlessLogo.svg";

const Asset = styled.span`
  position: relative;
`;

const Logo = styled(SeamlessLogo)`
  position: absolute;
  width: 21px;
  height: 21px;
  margin-top: 1px;
`;

const Symbol = styled.span`
  font-weight: 700;
  margin-left: 22px;
`;

const Token = ({ asset, start }) => (
  <Asset start={start}>
    <Logo />
    <Symbol>SEAM</Symbol>
  </Asset>
);

export default Token;
