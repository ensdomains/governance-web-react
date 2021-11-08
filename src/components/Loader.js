import React from "react"
import styled from "styled-components"

const Loader = styled("div")`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #7298f8;
  color: #7298f8;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;

  &:before,
  &:after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &:before {
    left: -15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #44bcf0;
    color: #44bcf0;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 0s;
  }

  &:after {
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #a099ff;
    color: #a099ff;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 1s;
  }

  @keyframes dotFlashing {
    0% {
      background-color: #44bcf0;
    }
    50%,
    100% {
      background-color: #a099ff;
    }
  }
`

const LoaderWrapper = styled("div")`
  ${(p) =>
    p.center &&
    `
    width: 100%;
    display: flex;
    justify-content: center;
  `}

  ${(p) =>
    p.large &&
    `
    padding: 50px 0;
    height: 120px;
  `}
`

export default function LoaderContainer({ center, large }) {
  return (
    <LoaderWrapper center={center} large={large}>
      <Loader />
    </LoaderWrapper>
  )
}
