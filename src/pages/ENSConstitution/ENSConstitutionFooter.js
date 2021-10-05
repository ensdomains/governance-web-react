import React from 'react';
import styled from "styled-components";
import {CTAButton} from "../../components/buttons";

const FooterContainer = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
`

const RightButtonsContainer = styled.div`
    display: grid;
    gap: 20px;
    grid-auto-flow: column;
`

const Footer = ({ backCallback, rejectVoteCallback, approveVoteCallback }) => {
    return (
        <FooterContainer>
            <CTAButton text="Back" onClick={backCallback} type="deny" />
            <RightButtonsContainer>
                <CTAButton text="Reject" onClick={rejectVoteCallback} type="reject" />
                <CTAButton text="Approve" onClick={approveVoteCallback} type="approve" />
            </RightButtonsContainer>
        </FooterContainer>
    );
};

export default Footer
