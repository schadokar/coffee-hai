import React, { Component } from "react";
import { Button, Form } from "semantic-ui-react";

class CustomerLogin extends Component {
  constructor() {
    super();
    this.state = {
      sendOTP: false
    };
  }

  otpSent = () => {
    this.setState({
      sendOTP: true
    });
  };

  otpForm = () => {
    if (this.state.sendOTP) {
      return (
        <Form.Field width="6">
          <label>Enter OTP</label>
          <input placeholder="Enter OTP" />
        </Form.Field>
      );
    }
  };

  buttonAction = () => {
    if (this.state.sendOTP) {
      return "Register";
    } else {
      return "Send OTP";
    }
  };

  render() {
    return (
      <div className="login-form">
        {" "}
        <Form>
          <Form.Field width="6">
            <label>Full Name</label>
            <input placeholder="Full Name" />
          </Form.Field>
          <Form.Field width="6">
            <label>Mobile no.</label>
            <input placeholder="Mobile No." />
          </Form.Field>

          {this.otpForm()}
          <Button type="submit" primary onClick={this.otpSent}>
            {this.buttonAction()}
          </Button>
        </Form>
      </div>
    );
  }
}

export default CustomerLogin;
