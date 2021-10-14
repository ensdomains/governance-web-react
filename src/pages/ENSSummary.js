import React from 'react';
import {ContentBox, NarrowColumn} from "../components/layout";
import SectionHeader from "./ENSConstitution/SectionHeader";
import {Content, Header} from "../components/text";
import Gap from "../components/Gap";

const EnsSummary = () => {
    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Submit your claim</Header>
                <Gap height={3}/>
                <Content>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In semper orci in dolor laoreet hendrerit. Duis rutrum eu magna non gravida. Vestibulum pulvinar ante eu tortor malesuada consectetur.
                </Content>
                <Gap height={3}/>
            </ContentBox>
        </NarrowColumn>
    );
};

export default EnsSummary;
