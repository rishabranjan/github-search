import React from "react";
import * as ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import App from "./App";
import "semantic-ui-css/semantic.min.css";
import "./index.css";

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://leetcode.com/graphql" }),
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  //   uri: "https://leetcode.com/graphql",
  fetchOptions: {
    mode: "no-cors",
  },
  cache: new InMemoryCache(),
});

// Supported in React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
