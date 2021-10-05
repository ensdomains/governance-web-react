import React from 'react';
import styled from "styled-components";

import {ContentBoxWithHeader, NarrowColumn} from "../../components/layout";
import SectionHeader from "./SectionHeader";
import Footer from "../../components/Footer";
import {getConstitution} from "./constitutionHelpers";

const ContentContainer = styled.div`
    display: grid;
    gap: 20px;
`

const EnsConstitutionSummary = () => {
    const constitution = getConstitution();

    return (
        <NarrowColumn>
           Constitution summary
        </NarrowColumn>
    );
};

export default EnsConstitutionSummary;
