import React, { Component } from "react";
import "./header.css";
import { Header, Icon } from "semantic-ui-react";

class AppHeader extends Component {
  constructor() {
    super();
    this.state = {
      actor: ""
    };
  }

  render() {
    return (
      <div>
        <Header>
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
