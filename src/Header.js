import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import styled from 'styled-components'

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px;
    background: lightpink;
`

const Header = () => {
    return (
        <HeaderContainer>
            <Switch>
                <Route path="/governance">
                    <div>How it works</div>
                </Route>
                <Route path="/distribution">
                    <div>How it works</div>
                </Route>
                <Route path="/constitution">
                    <div>ENS Constitution</div>
                </Route>
                <Route path="/delegates">
                    <div>Choose your delegate</div>
                </Route>
                <Route path="/claim">
                    <div>Claim $ENS</div>
                </Route>
                <Route path="/">
                    <div>Join the decentralisation of ENS</div>
                </Route>
            </Switch>
        </HeaderContainer>
    );
};

export default Header;
