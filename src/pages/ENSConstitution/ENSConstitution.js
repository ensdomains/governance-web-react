import React from 'react';
import {Route, Switch} from "react-router-dom";
import ENSConstitutionVoting from "./ENSConstitutionVoting";
import ENSConstitutionInfo from "./ENSConstitutionInfo";
import ENSConstitutionSummary from "./ENSConstitutionSummary";


const ENSConstitution = () => {

    return (
        <Switch>
            <Route path="/constitution/summary">
                <ENSConstitutionSummary/>
            </Route>
            <Route path="/constitution/vote">
                <ENSConstitutionVoting/>
            </Route>
            <Route path="/constitution/">
                <ENSConstitutionInfo/>
            </Route>
        </Switch>
    )
}

export default ENSConstitution;
