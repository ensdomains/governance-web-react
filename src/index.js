import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import * as Sentry from "@sentry/react";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initApolloClient } from "./apollo";

// only init sentry on live
if (window.location.host === "claim.ens.domains") {
  Sentry.init({
    dsn: "https://ea464a8965aa4b6fb75947d7754b83f8@o1010257.ingest.sentry.io/6055206",
    tracesSampleRate: 0,
  });
}

const client = initApolloClient();

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
