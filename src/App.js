import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Header from './Header'
import Home from './Home'
import ENSGovernance from "./ENSGovernance";
import ENSDistribution from "./ENSDistribution";
import ENSConstitution from "./ENSConstitution";
import ClaimENSToken from "./ClaimENSToken";
import ChooseYourDelegate from "./ChooseYourDelegate";

import './App.css';

const steps = [
    ','
]

function App() {
  return (
      <Router>
        <div>
          <Header />

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
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
