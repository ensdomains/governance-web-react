import styled from "styled-components";
import { ReactComponent as SplashENSLogo } from "../assets/imgs/SplashENSLogo.svg";

const Asset = styled.span`
  position: relative;
`;

const Logo = styled(SplashENSLogo)`
  position: absolute;
  width: 21px;
  height: 21px;
  margin-top: 1px;
`;

const Symbol = styled.span`
  font-weight: 700;
  color: #7e99f2;
  margin-left: 22px;
`;

const Token = ({ asset, start }) => (
  <Asset start={start}>
    <Logo />
    <Symbol>ENS</Symbol>
  </Asset>
);

export default Token;
