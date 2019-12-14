import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Form, Input } from "semantic-ui-react";
import axios from "axios";
import { serverUrl } from "../../config.json";

class CustomerLogin extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      mobileno: "",
      otpStatus: false,
      otp: "",
      redirect: false
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/customer"></Redirect>;
    }
  };

  otpForm = () => {
    if (this.state.otpStatus) {
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

  sendOTP = async () => {
    this.setState({
      otpStatus: true
    });

    const result = await axios.post(`${serverUrl}/sendotp`, {
      mobileno: this.state.mobileno
    });

    console.log(result.data);
  };

  verifyOTP = async () => {
    const { otp, mobileno, name } = this.state;

    const result = await axios.post(`${serverUrl}/verifyotp`, {
      otp,
      mobileno,
      name
    });

    console.log(result.data);

    if (result.data.status) {
      localStorage.setItem("customerToken", result.data.token);

      this.setState({
        redirect: true
      });
    }
  };

  buttonAction = () => {
    if (this.state.otpStatus) {
      return (
        <Button primary onClick={this.verifyOTP}>
          Register
        </Button>
      );
    } else {
      return (
        <Button primary onClick={this.sendOTP}>
          Send OTP
        </Button>
      );
    }
  };

  render() {
    return (
      <div className="login-form">
        {this.renderRedirect()}{" "}
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

          {this.buttonAction()}
        </Form>
      </div>
    );
  }
}

export default CustomerLogin;
