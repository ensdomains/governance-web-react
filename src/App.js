import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import styled from 'styled-components/macro'
import {ethers} from 'ethers'

import Header from './components/Header'
import Home from './pages/Home'
import ENSGovernance from "./pages/ENSGovernance";
import ENSDistribution from "./pages/ENSDistribution";
import ENSConstitution from "./pages/ENSConstitution";
import ClaimENSToken from "./pages/ClaimENSToken";
import ChooseYourDelegate from "./pages/ChooseYourDelegate";
import JoinENS from "./pages/JoinENS";
import Why from "./pages/Why";
import WhyNow from "./pages/WhyNow";
import {addressReactive, isConnected} from "./apollo";


const AppContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding-bottom: 100px;
  box-sizing: border-box;
`

const AppContainerOuter = styled.div`
  height: calc(100vh - 150px);
  display: flex;
`

const useInitApp = () => {
  useEffect(() => {
    const run = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider?.getSigner()
      let address;
      try {
        address = await signer.getAddress()
      } catch (e) {}
      if(address) {
        isConnected(true)
        addressReactive(address)
        return
      }
      isConnected(false)
      addressReactive(null)
    }
    run()
  }, [])
}

function App() {
  useInitApp()
  return (
      <Router>
        <Header />
        <AppContainerOuter>
          <AppContainer>
            <Switch>
              <Route path="/join">
                <JoinENS />
              </Route>
              <Route path="/why">
                <Why />
              </Route>
              <Route path="/whynow">
                <WhyNow />
              </Route>
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
          </AppContainer>
        </AppContainerOuter>
      </Router>
  );
}

export default App;
