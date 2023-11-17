import { css } from "styled-components/macro";

export const sizes = {
  maxWidth: "1226",
  tablet: "980",
  mobile: "768",
  sMobile: "480",
};

// iterate through the sizes and create a media template
export const smallerThan = Object.keys(sizes).reduce((accumulator, label) => {
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16;
  const newAcc = accumulator;
  newAcc[label] = (...args) => css`
    @media screen and (max-width: ${emSize}em) {
      ${css(...args)}
    }
  `;

  return newAcc;
}, {});

export const largerThan = Object.keys(sizes).reduce((accumulator, label) => {
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16;
  const newAcc = accumulator;
  newAcc[label] = (...args) => css`
    @media screen and (min-width: ${emSize}em) {
      ${css(...args)}
    }
  `;

  return newAcc;
}, {});

export const smallerThanRes = (res) => {
  const emSize = res / 16;
  return (...args) => css`
    @media screen and (max-width: ${emSize}em) {
      ${css(...args)}
    }
  `;
};
