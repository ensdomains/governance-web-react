import React from 'react';
import {Route, Switch} from "react-router-dom";
import ENSConstitutionVoting from "./ENSConstitutionVoting";
import ENSConstitutionSummary from "./ENSConstitutionSummary";


const ENSConstitution = () => {

    return (
        <Switch>
            <Route path="/constitution/summary">
                <ENSConstitutionSummary/>
            </Route>
            <Route path="/constitution">
                <ENSConstitutionVoting/>
            </Route>
        </Switch>
    )
}

export default ENSConstitution;
