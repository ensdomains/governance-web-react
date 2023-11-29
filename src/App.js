import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import styled from "styled-components/macro";
import Header from "./components/Header";
import SharedFooter from "./components/SharedFooter";
import Dashboard from "./pages/Dashboard";
import DelegateRanking from "./pages/DelegateRanking";
import DelegateTokens from "./pages/DelegateTokens";
import {
  setDelegateChoice,
  setDelegateReferral,
} from "./pages/ENSConstitution/delegateHelpers";
import EnteryourDelegate from "./pages/EnteryourDelegate";
import Home from "./pages/Home";
import { useGetDelegates, useQueryString } from "./utils/hooks";
import { hasClaimed } from "./utils/token";
import { initWeb3Read } from "./web3modal";
import Why from "./pages/Why";
import ENSGovernance from "./pages/ENSGovernance";
import ENSConstitution from "./pages/ENSConstitution/ENSConstitution";
import ENSConstitutionSign from "./pages/ENSConstitution/ENSConstitutionSign";
import ENSEP2ClaimSummary from "./pages/EP2/ENSEP2ClaimSummary";
import ENSEP2TokenClaim from "./pages/EP2/ENSEP2TokenClaim";

const AppContainer = styled.div`
  margin: auto;
  box-sizing: border-box;
  overflow-x: hidden;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const AppContainerOuter = styled.div`
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
`;

const AppContainerMid = styled.div`
  flex: 1 0 auto;
  align-items: center;
`;

const useInit = () => {
  useEffect(() => {
    initWeb3Read();
  }, []);
};

const PRIVATE_ROUTE_QUERY = gql`
  query privateRouteQuery @client {
    addressDetails
    ep2AddressDetails
    address
    isConnected
  }
`;

function PrivateRoute({ component: Component, type = "mainnet", ...rest }) {
  const { data } = useQuery(PRIVATE_ROUTE_QUERY);
  const history = useHistory();

  useEffect(() => {
    let finalAddressDetails =
      type === "mainnet" ? data.addressDetails : data.ep2AddressDetails;

    const run = async () => {
      try {
        if (
          finalAddressDetails.eligible !== undefined &&
          !finalAddressDetails.eligible
        ) {
          history.push("/dashboard");
          return;
        }
        const isClaimed = await hasClaimed(data.address, type);
        if (isClaimed) {
          history.push("/dashboard");
        }
      } catch (error) {
        console.error("Private Route error: ", error);
        history.push("/dashboard");
      }
    };

    if (
      data.isConnected &&
      data.address &&
      data.addressDetails.eligible !== undefined
    ) {
      run();
    }

    if (!data.address && data.isConnected) {
      history.push("/");
    }
  }, [
    data.address,
    data.isConnected,
    data.addressDetails,
    data.ep2AddressDetails,
  ]);

  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

function ConnectedRoute({ component: Component, ...rest }) {
  const { data } = useQuery(PRIVATE_ROUTE_QUERY);
  const history = useHistory();
  useEffect(() => {
    function run() {
      try {
        if (!data.address) {
          history.push("/");
        }
      } catch (error) {
        console.error("Connected Route error: ", error);
        history.push("/dashboard");
      }
    }

    if (data.isConnected && data.address) {
      run();
    }
  }, [data.address, data.isConnected]);
  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

function App() {
  const query = useQueryString();
  const {
    data: { address, isConnected },
  } = useQuery(gql`
    query getAddress @client {
      address
      isConnected
    }
  `);
  useEffect(() => {
    const delegate = query.get("delegate");
    if (delegate && address) {
      setDelegateChoice(address, delegate);
      setDelegateReferral(delegate);
    }
  }, [address]);

  // useGetDelegates(isConnected);

  return (
    <>
      <Header />
      <AppContainerOuter>
        <AppContainerMid>
          <AppContainer>
            <Switch>
              <PrivateRoute
                path="/manual-delegates"
                component={EnteryourDelegate}
              />
              <ConnectedRoute
                path="/manual-delegates-no-claim"
                component={EnteryourDelegate}
              />
              <PrivateRoute
                path="/delegate-tokens"
                component={DelegateTokens}
              />
              <PrivateRoute path="/delegates" component={EnteryourDelegate} />
              <PrivateRoute path="/why" component={Why}></PrivateRoute>
              <PrivateRoute path="/governance" component={ENSGovernance}></PrivateRoute>
              <PrivateRoute path="/constitution" component={ENSConstitution}></PrivateRoute>
              <PrivateRoute path="/signature" component={ENSConstitutionSign}></PrivateRoute>
              <PrivateRoute path="/claim" component={ENSEP2ClaimSummary}></PrivateRoute>
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/ep2/claim" component={ENSEP2TokenClaim} />
              <Route path="/delegate-ranking">
                <DelegateRanking />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </AppContainer>
        </AppContainerMid>
      </AppContainerOuter>
      <SharedFooter />
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
