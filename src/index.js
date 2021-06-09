import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "https://react-todo-2021.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "oQHWqK1WCIyI4is0pCN1KP0eGEW95PPF2A6yJkGaeIBe4xNI7d3vHYsjGh7a6MJh",
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
