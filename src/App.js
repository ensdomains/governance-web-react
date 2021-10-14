import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import styled from 'styled-components/macro'

import Header from './components/Header'
import Home from './pages/Home'
import ENSGovernance from "./pages/ENSGovernance";
import ENSConstitution from "./pages/ENSConstitution/ENSConstitution";
import ClaimENSToken from "./pages/ClaimENSToken";
import ChooseYourDelegate from "./pages/ChooseYourDelegate";
import Why from "./pages/Why";
import {initWeb3} from "./web3modal";
import ENSSummary from "./pages/ENSSummary";


const AppContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding-bottom: 100px;
  box-sizing: border-box;
  flex-grow: 1;
`

const AppContainerOuter = styled.div`
  height: calc(100vh - 150px);
  display: flex;
`

const useInitWeb3 = () => {
  useEffect(() => {
    initWeb3()
  }, [])
}

function App() {
  useInitWeb3()
  return (
      <Router>
        <Header />
        <AppContainerOuter>
          <AppContainer>
            <Switch>
              <Route path="/why">
                <Why />
              </Route>
              <Route path="/governance">
                <ENSGovernance />
              </Route>
              <Route path="/constitution">
                <ENSConstitution />
              </Route>
              <Route path="/delegates">
                <ChooseYourDelegate />
              </Route>
              <Route path="/claim">
                <ClaimENSToken />
              </Route>
              <Route path="/summary">
                <ENSSummary />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </AppContainer>
        </AppContainerOuter>
      </Router>
  );
}

export default App;
