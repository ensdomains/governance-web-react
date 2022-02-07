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
import ChooseYourDelegate from "./pages/ChooseYourDelegate";
import Dashboard from "./pages/Dashboard";
import DelegateRanking from "./pages/DelegateRanking";
import DelegateTokens from "./pages/DelegateTokens";
import Delegation from "./pages/Delegation";
import ENSClaimSuccess from "./pages/ENSClaimSuccess";
import {
  setDelegateChoice,
  setDelegateReferral,
} from "./pages/ENSConstitution/delegateHelpers";
import ENSGovernance from "./pages/ENSGovernance";
import ENSSummary from "./pages/ENSSummary";
import ENSTokenClaim from "./pages/EnsTokenClaim";
import EnteryourDelegate from "./pages/EnteryourDelegate";
import ENSEP2ClaimSuccess from "./pages/EP2/ENSEP2ClaimSuccess";
import ENSEP2ClaimSummary from "./pages/EP2/ENSEP2ClaimSummary";
import ENSEP2TokenClaim from "./pages/EP2/ENSEP2TokenClaim";
import Home from "./pages/Home";
import Why from "./pages/Why";
import { useGetDelegates, useQueryString } from "./utils/hooks";
import { hasClaimed } from "./utils/token";
import { initWeb3Read } from "./web3modal";

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
  }, [
    data.address,
    data.isConnected,
    data.addressDetails.eligible,
    data.ep2AddressDetails.eligible,
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

  useGetDelegates(isConnected);

  return (
    <>
      <Header />
      <AppContainerOuter>
        <AppContainerMid>
          <AppContainer>
            <Switch>
              <PrivateRoute path="/why" component={Why} />
              <PrivateRoute path="/governance" component={ENSGovernance} />
              <PrivateRoute path="/delegates" component={ChooseYourDelegate} />
              <PrivateRoute
                path="/manual-delegates"
                component={EnteryourDelegate}
              />
              <PrivateRoute
                path="/manual-delegates-no-claim"
                component={EnteryourDelegate}
              />
              <ConnectedRoute
                path="/delegate-tokens"
                component={DelegateTokens}
              />
              <PrivateRoute
                path="/ep2/summary"
                type="ep2"
                component={ENSEP2ClaimSummary}
              />
              <PrivateRoute
                path="/ep2/claim"
                type="ep2"
                component={ENSEP2TokenClaim}
              />
              <PrivateRoute
                path="/ep2/success"
                type="ep2"
                component={ENSEP2ClaimSuccess}
              />
              <PrivateRoute path="/summary/claim" component={ENSTokenClaim} />
              <PrivateRoute path="/summary" component={ENSSummary} />
              <PrivateRoute path="/success" component={ENSClaimSuccess} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route path="/delegate-ranking">
                <DelegateRanking />
              </Route>
              <PrivateRoute path="/delegation" component={Delegation} />
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </AppContainer>
        </AppContainerMid>
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
