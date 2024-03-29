import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import React, { useEffect } from "react";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
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
import {
  setDelegateChoice,
  setDelegateReferral,
} from "./pages/ENSConstitution/delegateHelpers";
import EnteryourDelegate from "./pages/EnteryourDelegate";
import Home from "./pages/Home";
import { useGetDelegates, useQueryString } from "./utils/hooks";
import { initWeb3Read, rpcUrl } from "./web3modal";
import { usePrevious } from "react-use";

const PROJECT_ID = "02f438d1701ea8029113972850066224";

const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: rpcUrl,
};

const metadata = {
  name: "ENS Delegation App",
  description: "Delegate your ENS name to a delegate of your choice",
  url: "https://delegate.ens.domains",
  icons: ["https://delegate.ens.domains/favicon-32x32.png"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId: PROJECT_ID,
});

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
  }
`;

function PrivateRoute({ component: Component, type = "mainnet", ...rest }) {
  const { data } = useQuery(PRIVATE_ROUTE_QUERY);
  const history = useHistory();
  const { address, isConnected } = useWeb3ModalAccount();

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
      } catch (error) {
        console.error("Private Route error: ", error);
        history.push("/dashboard");
      }
    };

    if (isConnected && address && data.addressDetails.eligible !== undefined) {
      run();
    }

    if (!address && isConnected) {
      history.push("/");
    }
  }, [address, isConnected, data.addressDetails, data.ep2AddressDetails]);

  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

function ConnectedRoute({ component: Component, ...rest }) {
  const { address, isConnected } = useWeb3ModalAccount();

  const history = useHistory();
  useEffect(() => {
    function run() {
      try {
        if (!address) {
          history.push("/");
        }
      } catch (error) {
        console.error("Connected Route error: ", error);
        history.push("/dashboard");
      }
    }

    if (isConnected && address) {
      run();
    }
  }, [address, isConnected]);
  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

function App() {
  const query = useQueryString();
  const { address } = useWeb3ModalAccount();
  const previousAddress = usePrevious(address);

  useEffect(() => {
    const delegate = query.get("delegate");
    if (delegate && address) {
      setDelegateChoice(address, delegate);
      setDelegateReferral(delegate);
    }

    if (previousAddress && address && previousAddress !== address) {
      window.location.reload();
    }
  }, [address]);

  return (
    <>
      <Header />
      <AppContainerOuter>
        <AppContainerMid>
          <AppContainer>
            <Switch>
              <PrivateRoute path="/delegates" component={ChooseYourDelegate} />
              <PrivateRoute
                path="/manual-delegates"
                component={EnteryourDelegate}
              />
              <ConnectedRoute
                path="/manual-delegates-no-claim"
                component={EnteryourDelegate}
              />
              <ConnectedRoute
                path="/delegate-tokens"
                component={DelegateTokens}
              />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route path="/delegate-ranking">
                <DelegateRanking />
              </Route>
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
  useGetDelegates();
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Index;
