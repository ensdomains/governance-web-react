import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import styled from 'styled-components/macro'

import Header from './Header'
import Home from './Home'
import ENSGovernance from "./ENSGovernance";
import ENSDistribution from "./ENSDistribution";
import ENSConstitution from "./ENSConstitution";
import ClaimENSToken from "./ClaimENSToken";
import ChooseYourDelegate from "./ChooseYourDelegate";
import JoinENS from "./JoinENS";

import './App.css';

const steps = [
    ','
]

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

function App() {
  return (
      <Router>
        <Header />
        <AppContainer>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
