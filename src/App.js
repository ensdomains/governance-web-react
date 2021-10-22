import React, {useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import styled from 'styled-components/macro'
import {gql} from "graphql-tag";

import Header from './components/Header'
import Home from './pages/Home'
import ENSGovernance from "./pages/ENSGovernance";
import ENSConstitution from "./pages/ENSConstitution/ENSConstitution";
import ClaimENSToken from "./pages/ClaimENSToken";
import ChooseYourDelegate from "./pages/ChooseYourDelegate";
import Why from "./pages/Why";
import {initWeb3} from "./web3modal";
import ENSSummary from "./pages/ENSSummary";
import {useQuery} from "@apollo/client";
import EnteryourDelegate from "./pages/EnteryourDelegate";


const AppContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding-bottom: 100px;
  box-sizing: border-box;
  flex-grow: 1;
  overflow-x: hidden;
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

const PRIVATE_ROUTE_QUERY = gql`
  query privateRouteQuery @client {
    addressDetails
    isConnected
  }
`

function PrivateRoute({component: Component, addressDetails, ...rest}) {
    const {data} = useQuery(PRIVATE_ROUTE_QUERY)
    const history = useHistory();

    if (history && data?.addressDetails?.eligible !== undefined) {
        if (!data.addressDetails.eligible) {
            history.push('/claim')
        }
    }

    return (
        <Route {...rest} render={props => <Component {...props} />}/>
    );
}

function App() {
    useInitWeb3()
    return (
        <Router>
            <Header/>
            <AppContainerOuter>
                <AppContainer>
                    <Switch>
                        <PrivateRoute path="/why" component={Why}/>
                        <PrivateRoute path="/governance" component={ENSGovernance}/>
                        <PrivateRoute path="/constitution" component={ENSConstitution}/>
                        <PrivateRoute path="/delegates" component={ChooseYourDelegate}/>
                        <PrivateRoute path="/manual-delegates" component={EnteryourDelegate}/>
                        <PrivateRoute path="/summary" component={ENSSummary}/>
                        <Route path="/claim">
                            <ClaimENSToken/>
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </AppContainer>
            </AppContainerOuter>
        </Router>
    );
}

export default App;
