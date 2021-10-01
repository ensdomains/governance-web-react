import React, {useEffect, useState, useCallback} from 'react';
import styled from 'styled-components/macro'
import {Route, Switch, useHistory} from "react-router-dom";
import {Client, Utils} from '@snapshot-labs/snapshot.js'
import {hexlify} from '@ethersproject/bytes';


import Footer from '../../components/Footer'
import Gap from '../../components/Gap'
import {Header, Content} from '../../components/text'
import {ContentBox, ContentBoxWithHeader, NarrowColumn} from "../../components/layout";
import {getEthersProvider} from "../../web3modal";
import {useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import {PROPOSAL_ID} from "../../utils/consts";
import SectionHeader from "./SectionHeader";

import {getEarliestUnvotedArticle, getTotalNumberOfArticles} from "./constitutionHelpers";


export async function signMessage(web3, msg, address) {
    msg = hexlify(new Buffer(msg, 'utf8'));
    return await web3.send('personal_sign', [msg, address]);
}

const createSignedMessage = () => {

}

const GET_USER_VOTES = gql`
    query Votes($voter: String!) {
      votes(
        where: {
          voter: $voter
          proposal: "${PROPOSAL_ID}"
        }
      ) {
        choice
      }
    }
`



const ENSConstitutionInfo = () => {
    const history = useHistory();

    const {data: {address}} = useQuery(gql`
        query getHeaderData @client {
            address
        }
    `)

    const {data} = useQuery(
        GET_USER_VOTES,
        {
            skip: !address,
            variables: {
                voter: address
            }
        }
    )

    const previousVote = data?.votes?.[0]?.choice
    console.log('previousVote: ', previousVote)

    useEffect(() => {
        if (address) {
            const snapshotClient = new Client()
            const ethersProvider = getEthersProvider()
            // snapshotClient.vote(
            //     ethersProvider,
            //     address,
            //     'bananana.eth',
            //     {proposal: PROPOSAL_ID, choice: [1, 2, 3]}
            // )
        }
    }, [address])

    return (
        <NarrowColumn>
            <ContentBox>
                <Content>
                    Over the past 12 months, ENS has seen <b>massive growth</b> in both the registration and usage of
                    ENS names. We firmly believe that now is the time for the protocol to start to become entirely
                    self-sufficient and community owned.
                </Content>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/constitution/vote')
                }}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/governance')
                }}
            />
        </NarrowColumn>
    );
};


export default ENSConstitutionInfo;
