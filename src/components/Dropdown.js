import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const DropdownContainer = styled.div`
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
  position: absolute;
  width: ${(p) => (p.width ? p.width : "100")}px;
  z-index: 1;
  ${(p) =>
    p.isOpen
      ? `
    visibility: visible;
    margin-top: 10px;
    opacity: 100%;
  `
      : `
    visibility: hidden;
    margin-top: -100px;
    opacity: 0;
  `}

  transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0s linear;
`;

const DropdownItem = styled.div`
  border: none;
  background: none;
  font-family: inherit;
  letter-spacing: -0.01em;
  font-weight: bold;
  font-size: 18px;
  line-height: 21.6px;
  width: 100%;
  text-align: left;
  padding: 12px;
  color: ${(p) => {
    switch (p.type) {
      case "deny":
        return "#F55555;";
      case "disabled":
        return "#ACACAC";
      default:
        return "#717171";
    }
  }};
  opacity: ${(p) => (p.type === "deny" ? "0.7" : "0.5")};
  border-radius: 10px;
  transition: all 0.2s ease-out;
  cursor: pointer;
  pointer-events: ${(p) => (p.type === "disabled" ? "none" : "initial")};

  &:hover {
    opacity: 1;
  }
`;

const DropdownWrapperContainer = styled.div`
  position: relative;
`;

const DropdownMenu = ({ dropdownItems, isOpen, setIsOpen, width }) => {
  const history = useHistory();

  useEffect(() => {
    return () => setIsOpen(false);
  }, []);

  return (
    <DropdownContainer width={width} isOpen={isOpen}>
      {dropdownItems.map((item, inx) => (
        <DropdownItem
          onClick={() =>
            Promise.resolve(
              item.action ? item.action() : history.push(item.link)
            ).then(() => setIsOpen(false))
          }
          type={item.type}
          key={inx}
        >
          {item.name}
        </DropdownItem>
      ))}
    </DropdownContainer>
  );
};

const DropdownWrapper = ({ dropdownItems, isOpen, setIsOpen, children }) => {
  const dropdownRef = useRef();

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, isOpen]);

  return (
    <DropdownWrapperContainer ref={dropdownRef}>
      {children}
      <DropdownMenu
        dropdownItems={dropdownItems}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width={dropdownRef.current && dropdownRef.current.offsetWidth}
      />
    </DropdownWrapperContainer>
  );
};

export default DropdownWrapper;
