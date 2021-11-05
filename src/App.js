import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";
import styled from "styled-components/macro";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";

import Header from "./components/Header";
import Home from "./pages/Home";
import ENSGovernance from "./pages/ENSGovernance";
import ENSConstitution from "./pages/ENSConstitution/ENSConstitution";
import Dashboard from "./pages/Dashboard";
import ChooseYourDelegate from "./pages/ChooseYourDelegate";
import Why from "./pages/Why";
import { initWeb3 } from "./web3modal";
import ENSSummary from "./pages/ENSSummary";
import EnteryourDelegate from "./pages/EnteryourDelegate";
import ENSConstitutionSign from "./pages/ENSConstitution/ENSConstitutionSign";
import ENSTokenClaim from "./pages/EnsTokenClaim";
import ENSClaimSuccess from "./pages/ENSClaimSuccess";
import SharedFooter from "./components/SharedFooter";
import { hasClaimed } from "./utils/tokenClaim";

import {
  setDelegateChoice,
  setDelegateReferral,
} from "./pages/ENSConstitution/delegateHelpers";
import { useQueryString } from "./utils/hooks";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding-bottom: 80px;
  box-sizing: border-box;
  flex-grow: 1;
  overflow-x: hidden;
`;

const AppContainerOuter = styled.div`
  display: flex;
  flex-direction: column;
`;

const useInit = () => {
  useEffect(() => {
    initWeb3();
  }, []);
};

const PRIVATE_ROUTE_QUERY = gql`
  query privateRouteQuery @client {
    addressDetails
    address
    isConnected
  }
`;

function PrivateRoute({ component: Component, addressDetails, ...rest }) {
  const { data } = useQuery(PRIVATE_ROUTE_QUERY);
  const history = useHistory();

  useEffect(() => {
    const run = async () => {
      try {
        if (
          data.addressDetails.eligible !== undefined &&
          !data.addressDetails.eligible
        ) {
          history.push("/dashboard");
          return;
        }
        const isClaimed = await hasClaimed(data.address);
        if (isClaimed) {
          history.push("/dashboard");
        }
      } catch (error) {
        console.error("Private Route error: ", error);
        history.push("/dashboard");
      }
    };

    if (data.isConnected && data.addressDetails.eligible !== undefined) {
      run();
    }
  }, [data.address, data.isConnected, data.addressDetails.eligible]);

  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

function App() {
  const query = useQueryString();
  const {
    data: { address },
  } = useQuery(gql`
    query getAddress @client {
      address
    }
  `);
  useEffect(() => {
    const delegate = query.get("delegate");
    if (delegate && address) {
      setDelegateChoice(address, delegate);
      setDelegateReferral(delegate);
    }
  }, [address]);

  return (
    <>
      <Header />
      <AppContainerOuter>
        <AppContainer>
          <Switch>
            <PrivateRoute path="/why" component={Why} />
            <PrivateRoute path="/governance" component={ENSGovernance} />
            <PrivateRoute
              path="/constitution/sign"
              component={ENSConstitutionSign}
            />
            <PrivateRoute path="/constitution" component={ENSConstitution} />
            <PrivateRoute path="/delegates" component={ChooseYourDelegate} />
            <PrivateRoute
              path="/manual-delegates"
              component={EnteryourDelegate}
            />
            <PrivateRoute path="/summary/claim" component={ENSTokenClaim} />
            <PrivateRoute path="/summary" component={ENSSummary} />
            <PrivateRoute path="/success" component={ENSClaimSuccess} />
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </AppContainer>
        <SharedFooter />
      </AppContainerOuter>
    </>
  );
}

function Index() {
  useInit();
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Index;
