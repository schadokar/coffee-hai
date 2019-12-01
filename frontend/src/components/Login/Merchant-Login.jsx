import React, { Component } from "react";
import { Button, Form, Input } from "semantic-ui-react";
class MerchantLogin extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      mobileno: "",
      sendOTP: false,
      otp: ""
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

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
          <Input
            type="text"
            name="otp"
            value={this.state.otp}
            onChange={this.onChange}
            placeholder="Enter OTP"
          />
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
            <Input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Full Name"
            />
          </Form.Field>
          <Form.Field width="6">
            <label>Mobile no.</label>
            <Input
              type="text"
              name="mobileno"
              value={this.state.mobileno}
              onChange={this.onChange}
              placeholder="Mobile no."
            />
          </Form.Field>

          {this.otpForm()}
          <Button primary onClick={this.otpSent}>
            {this.buttonAction()}
          </Button>
        </Form>
      </div>
    );
  }
}

export default MerchantLogin;
