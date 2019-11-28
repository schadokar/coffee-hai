import React, { Component } from "react";
import "./login.css";
import axios from "axios";
import { Button, Icon } from "semantic-ui-react";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      userID: ""
    };
  }

  render() {
    return (
      <div>
        <div className="quote">
          Coffee is a beverage that puts one to sleep when not drank. - Alphonse
          Allais
        </div>

        <div className="login-page">
          <span className="login-button">
            <Button color="orange">
              <Icon name="coffee"></Icon>
              Merchant Login
            </Button>
          </span>
          <span className="login-button">
            <Button className="login-button" color="blue">
              {" "}
              <Icon name="truck"></Icon>Delivery Login
            </Button>
          </span>
          <span className="login-button">
            <Button className="login-button" color="green">
              {" "}
              <Icon name="user"></Icon>Customer Login
            </Button>
          </span>
        </div>
      </div>
    );
  }
}

export default Login;
