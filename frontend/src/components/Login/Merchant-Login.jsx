import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Form, Input } from "semantic-ui-react";
import axios from "axios";
import { serverUrl } from "../../config.json";

class MerchantLogin extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      mobileno: "",
      otpStatus: false,
      otp: "",
      redirect: false,
      method: "",
      actor: "Merchant"
    };
  }

  componentDidMount = () => {
    // set the otp method
    this.setState({
      method: process.env.REACT_APP_METHOD
    });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/merchant"></Redirect>;
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
    const { mobileno, method } = this.state;

    this.setState({
      otpStatus: true
    });

    const result = await axios.post(`${serverUrl}/sendotp`, {
      mobileno: mobileno,
      method: method
    });

    console.log(result.data);
  };

  verifyOTP = async () => {
    const { otp, mobileno, name, actor, method } = this.state;

    const result = await axios.post(`${serverUrl}/verifyotp`, {
      otp,
      mobileno,
      name,
      actor,
      method
    });

    console.log(result.data);

    if (result.data.status) {
      // save jwt token in the local storage of the browser
      localStorage.setItem("merchantToken", result.data.token);

      // redirect to merchant page
      this.setState({
        redirect: true
      });
    }
  };

  // Toggle button action from send otp to signin
  buttonAction = () => {
    if (this.state.otpStatus) {
      return (
        <div>
          <Button primary onClick={() => this.verifyOTP()}>
            Sign In
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button primary onClick={() => this.sendOTP()}>
            Send OTP
          </Button>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="login-form">
        {this.renderRedirect()}{" "}
        <Form>
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

export default MerchantLogin;
