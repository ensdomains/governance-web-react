import styled from 'styled-components'

import theme from './theme'

export const Link = styled.a`
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.01em;
    color: ${theme.colors.text.medium};
    opacity: 0.6;
    text-decoration: none;
    
    &:hover {
        opacity: 1;
    }
    
    &:active {
        color: ${theme.colors.blue};
    }
`

export const Title = styled.div`
    font-size: 72px;
    background: linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    font-size: 50px;
    line-height: 60px;
    text-align: center;
    letter-spacing: -0.01em;
`

export const SubTitle = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 150%;
    text-align: center;
    letter-spacing: -0.01em;
    color: ${theme.colors.text.medium};
`

export const SubsubTitle = styled.div`
    font-style: normal;
    font-weight: normal;    
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.01em;
    color: #717171;
    opacity: 0.6;  
`

export const Header = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 31px;
    display: flex;
    align-items: center;
    letter-spacing: -0.01em;
    color: #000000;
`

export const Content = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 141%;
  color: #1A1A1A;
`

export const Statistic = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 32px;
    line-height: 141%;
    letter-spacing: -0.01em;
    color: #000000;
    display: flex;
`

export const TokenText = styled.span`
    color: ${theme.colors.blue};
    font-weight: bold;
`

export const IntegerBalance = styled.span`
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 141%;
  letter-spacing: -0.01em;
  color: #000000;
`

export const DecimalBalance = styled.span`
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 141%;
  letter-spacing: -0.01em;
  color: #BFBFBF;
`
