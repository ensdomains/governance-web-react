import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import styled from 'styled-components/macro'
import {ethers} from 'ethers'

import Header from './Header'
import Home from './Home'
import ENSGovernance from "./ENSGovernance";
import ENSDistribution from "./ENSDistribution";
import ENSConstitution from "./ENSConstitution";
import ClaimENSToken from "./ClaimENSToken";
import ChooseYourDelegate from "./ChooseYourDelegate";
import JoinENS from "./JoinENS";

import './App.css';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const useInitApp = () => {
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
  }, [])
}

function App() {
  useInitApp()
  return (
      <Router>
        <Header />
        <AppContainer>
          <Switch>
            <Route path="/governance">
              <ENSGovernance />
            </Route>
            <Route path="/distribution">
              <ENSDistribution />
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
            <Route path="/join">
              <JoinENS />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </AppContainer>
      </Router>
  );
}

export default App;
