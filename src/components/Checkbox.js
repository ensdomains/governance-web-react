import React from "react";
import styled from "styled-components";

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const CheckboxLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const StyledCheckbox = styled.input`
  opacity: 0;
  position: absolute;
`;

const CheckboxCustom = styled.span`
  position: relative;
  width: 20px;
  height: 20px;
  border: 2px solid #3498db;
  border-radius: 3px;
  background-color: transparent;
  margin-right: 8px;

  ${StyledCheckbox}:checked + & {
    background-color: #3498db;
    border-color: #3498db;
  }

  &:after {
    content: "";
    position: absolute;
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform-origin: bottom;
  }

  ${StyledCheckbox}:checked + &:after {
    margin-left: 8px;
    display: block;
  }
`;

const StyledCheckboxComponent = () => {
  return (
    <CheckboxContainer>
      <CheckboxLabel>
        I have read and agree to the Terms of Service
        <StyledCheckbox type="checkbox" />
        <CheckboxCustom />
      </CheckboxLabel>
    </CheckboxContainer>
  );
};

export default StyledCheckboxComponent;
