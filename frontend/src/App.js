import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import AppHeader from "./components/Header/index.js";

import MerchantLogin from "./components/Login/Merchant-Login";
import DeliveryLogin from "./components/Login/Delivery-Login";
import CustomerLogin from "./components/Login/Customer-Login";

import Login from "./components/Login/index.js";

function App() {
  return (
    <div className="App">
      <Container>
        <AppHeader></AppHeader>
        <Router>
          <Route exact path="/">
            <Login></Login>
          </Route>
          <Route exact path="/merchant/login">
            <MerchantLogin></MerchantLogin>
          </Route>
          <Route exact path="/delivery/login">
            <DeliveryLogin></DeliveryLogin>
          </Route>
          <Route exact path="/customer/login">
            <CustomerLogin></CustomerLogin>
          </Route>
        </Router>
      </Container>
    </div>
  );
}

export default App;
