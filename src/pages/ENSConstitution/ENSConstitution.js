import React from "react";
import { Route, Switch } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import ENSConstitutionVoting from "./ENSConstitutionVoting";
import ENSConstitutionSummary from "./ENSConstitutionSummary";

const ENSConstitution = () => {
  const {
    data: { address: account, isConnected },
  } = useQuery(gql`
    query getAddress @client {
      address
      isConnected
    }
  `);
  if (!isConnected) return null;
  return (
    <Switch>
      <Route path="/constitution/summary">
        <ENSConstitutionSummary account={account} />
      </Route>
      <Route path="/constitution">
        <ENSConstitutionVoting account={account} />
      </Route>
    </Switch>
  );
};

export default ENSConstitution;
