import styled from 'styled-components'

const Asset = styled.span`
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: center;
  position: relative;
  top: 5px;
  height: 14px;
  margin-right: 2px;
  margin-left: 2px;
  border-radius: 100px;
  ${({ start }) => start && `margin-left: 0px;`}
`

const Logo = styled.img`
  margin-right: 4px;
`

const Symbol = styled.span`
  display: inline;
  text-transform: uppercase;
  letter-spacing: 0.03rem;
  margin-top: 0.5px;
  font-size: 13px;
  font-weight: 500;
  color: white;
`

const Token = ({ asset, start }) => (
    <Asset start={start}>
        <Logo src={`../assets/img/SplashENSLogo.svg`} width={21} />
        <Symbol>ENS</Symbol>
    </Asset>
)

export const SimpleToken = () => (
    <img
        src="../assets/imgs/SplashENSLogo.svg"
        width={21}
        style={{
            display: 'inline-block',
            position: 'relative',
            top: '-2px',
            marginRight: '0.1rem',
            marginLeft: '0.1rem',
        }}
    />
)

export default Token
