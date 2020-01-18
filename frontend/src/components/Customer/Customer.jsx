import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./customer.css";
import axios from "axios";
import { Menu, Button, Divider, Grid, Segment } from "semantic-ui-react";
import { dbURL, serverUrl } from "../../config.json";
// import Item table
import { Items } from "../Items/index";
// import Orders Table
import { Orders } from "../Orders/index";

class Customer extends Component {
  constructor() {
    super();
    this.state = {
      customerID: "",
      name: "",
      token: "",
      orders: [],
      redirect: false,
      orderStatus: "order_placed",
      method: "",
      activeItem: "items"
    };
  }

  // handle Menu item click
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentDidMount = () => {
    // get the token from the local storage
    const token = localStorage.getItem("customerToken");

    // check if user is logged in or not
    if (token === null) {
      // redirect to the dashboard
      this.setState({
        redirect: true
      });
    } else {
      // 2nd parameter in the token is a payload
      // it is a simple base64 encoded message
      // we can extract the userID and name from it
      const data = token.split(".")[1];

      // create a buffer
      let buff = new Buffer(data, "base64");
      // convert the buffer to ascii and then to JSON object
      let userObj = JSON.parse(buff.toString("ascii"));

      // extract the name and userID from user in the userObj
      const { name, userID } = userObj.user;

      // set the state of token, name, and customerID
      this.setState({ token, name, customerID: userID });

      // set the axios default header to token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // call the getOrderList
      this.getOrderList();
    }

    // set the notification method
    this.setState({ method: process.env.REACT_APP_METHOD });
  };

  getOrderList = async () => {
    const orders = await axios.get(`${dbURL}/getOrdersByCustomer`);

    this.setState({
      orders: orders.data
    });
  };

  changeOrderStatus = async orderID => {
    // cancel the order
    const res = await axios.put(
      `${dbURL}/updateOrderStatus/${orderID}/cancelled`
    );

    // if order status successfully updated
    // then send notification to merchant and customer
    if (res.status) {
      this.sendNotification(orderID);
    }

    console.log(res);

    this.getOrderList();
  };

  sendNotification = async orderID => {
    const { method } = this.state;

    // send notification to merchant and customer
    const notificationStatus = await axios.post(
      `${serverUrl}/sendnotification`,
      {
        orderID,
        method
      }
    );

    console.log("notification status: ", notificationStatus);
  };

  logout = () => {
    // clear the token from the storage
    localStorage.removeItem("customerToken");

    // redirect to the dashboard
    this.setState({ redirect: true });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/"></Redirect>;
    }
  };

  // return the table of orders or items w.r.t to selected option
  selectedTab = () => {
    switch (this.state.activeItem) {
      case "orders":
        return (
          <Orders
            orders={this.state.orders}
            btnStatement={"Cancel"}
            btnColor={"red"}
            changeOrderStatus={this.changeOrderStatus}
          />
        );
      case "items":
        return <Items customerID={this.state.customerID} />;
      default:
        return <Items customerID={this.state.customerID} />;
    }
  };

  render() {
    const { customerID, name, activeItem } = this.state;

    return (
      <div>
        {this.renderRedirect()}

        <Menu secondary>
          <Menu.Item>{name}</Menu.Item>
          <Menu.Item>{customerID}</Menu.Item>

          <Menu.Item position="right">
            <Button onClick={() => this.logout()} color="black">
              Logout
            </Button>
          </Menu.Item>
        </Menu>
        <Divider></Divider>
        <Grid>
          <Grid.Column width={3}>
            <Menu fluid vertical tabular>
              <Menu.Item
                name="items"
                active={activeItem === "items"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="orders"
                active={activeItem === "orders"}
                onClick={this.handleItemClick}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column width={13}>
            <Segment>{this.selectedTab()}</Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Customer;
