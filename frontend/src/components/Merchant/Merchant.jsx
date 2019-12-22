import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./merchant.css";

import axios from "axios";
import { Menu, Button, Divider, Table } from "semantic-ui-react";
import { dbURL, serverUrl } from "../../config.json";

class Merchant extends Component {
  constructor() {
    super();
    this.state = {
      merchantID: "",
      name: "",
      token: "",
      orders: [],
      ordersTable: [],
      redirect: false,
      method: ""
    };
  }

  // use jwt to extract the merchant details
  componentDidMount = () => {
    // get the token from the local storage
    const token = localStorage.getItem("merchantToken");

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

      // set the state of token, name, and merchantID
      this.setState({ token, name, merchantID: userID });

      // set the axios default header to token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // call the getOrderList
      this.getOrderList();
    }

    // set the notification method
    this.setState({ method: process.env.REACT_APP_METHOD });
  };

  // get orders for the merchant
  getOrderList = async () => {
    const orders = await axios.get(`${dbURL}/getOrdersByMerchant`);

    console.log(orders.data);
    this.setState(
      {
        orders: orders.data
      },
      () => {
        this.createOrderTable();
      }
    );
  };

  // change order status from order_placed to order_ready
  changeOrderStatus = async orderID => {
    // update the status of the order to order_ready
    const res = await axios.put(
      `${dbURL}/updateOrderStatus/${orderID}/order_ready`
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

  // create order table of the merchant
  createOrderTable = () => {
    const { orders } = this.state;

    if (orders != null) {
      const table = orders.map((order, index) => {
        return (
          <Table.Row key={index}>
            <Table.Cell>{order.orderID}</Table.Cell>
            <Table.Cell>{order.merchantID}</Table.Cell>
            <Table.Cell>{order.deliveryID}</Table.Cell>
            <Table.Cell>{order.customerID}</Table.Cell>
            <Table.Cell>{order.orderStatus}</Table.Cell>
            <Table.Cell>
              <Button
                color="green"
                onClick={() => this.changeOrderStatus(order.orderID)}
              >
                Order Ready
              </Button>
            </Table.Cell>
          </Table.Row>
        );
      });

      this.setState({
        ordersTable: table
      });
    }
  };

  logout = () => {
    // clear the token from the storage
    localStorage.removeItem("merchantToken");

    // redirect to the dashboard
    this.setState({ redirect: true });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/"></Redirect>;
    }
  };

  render() {
    const { merchantID, name } = this.state;

    return (
      <div>
        {this.renderRedirect()}
        <Menu secondary>
          <Menu.Item>{name}</Menu.Item>
          <Menu.Item>{merchantID}</Menu.Item>

          <Menu.Item position="right">
            <Button onClick={() => this.logout()} color="black">
              Logout
            </Button>
          </Menu.Item>
        </Menu>
        <Divider horizontal>Orders</Divider>
        <div className="merchant-table">
          <Table color="brown">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order ID</Table.HeaderCell>
                <Table.HeaderCell>Merchant ID</Table.HeaderCell>
                <Table.HeaderCell>Delivery ID</Table.HeaderCell>
                <Table.HeaderCell>Customer ID</Table.HeaderCell>
                <Table.HeaderCell>Order Status</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.state.ordersTable}</Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

export default Merchant;
