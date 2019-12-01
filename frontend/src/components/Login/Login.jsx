import React, { Component } from "react";
import "./login.css";
// import axios from "axios";
import { Redirect } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      userID: "",
      to: "",
      redirect: false
    };
  }

  setRedirect = to => {
    this.setState({
      redirect: true,
      to: `/${to}/login`
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.to} />;
    }
  };

  render() {
    return (
      <div>
        {this.renderRedirect()}

        <div className="quote">
          Coffee is a beverage that puts one to sleep when not drank. - Alphonse
          Allais
        </div>

        <div className="login-page">
          <span className="login-button">
            <Button color="orange" onClick={() => this.setRedirect("merchant")}>
              <Icon name="coffee"></Icon>
              Merchant Login
            </Button>
          </span>
          <span className="login-button">
            <Button color="blue" onClick={() => this.setRedirect("delivery")}>
              {" "}
              <Icon name="truck"></Icon>Delivery Login
            </Button>
          </span>
          <span className="login-button">
            <Button color="green" onClick={() => this.setRedirect("customer")}>
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
