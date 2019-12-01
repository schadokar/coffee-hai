import React, { Component } from "react";
import "./header.css";
import { Redirect } from "react-router-dom";
import { Header, Icon } from "semantic-ui-react";

class AppHeader extends Component {
  constructor() {
    super();
    this.state = {
      actor: "",
      redirect: false
    };
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/"></Redirect>;
    }
  };

  render() {
    return (
      <div>
        {this.renderRedirect()}

        <Header as="a" href="/">
          <div className="app-header">
            <Icon name="coffee"></Icon>
            Coffee Hai
          </div>
        </Header>
      </div>
    );
  }
}

export default AppHeader;
