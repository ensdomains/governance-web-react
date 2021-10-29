import styled from 'styled-components'
import SplashENSLogo from '../assets/imgs/SplashENSLogo.svg'

const Asset = styled.span`
    position: relative
`

const Logo = styled.img`
    position: absolute;
`

const Symbol = styled.span`
  font-weight: 700;
  color: #7E99F2;
  margin-left: 22px;
`

const Token = ({ asset, start }) => (
    <Asset start={start}>
        <Logo src={SplashENSLogo} width={21} />
        <Symbol>ENS</Symbol>
    </Asset>
)

export default Token
