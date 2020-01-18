import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./delivery.css";
import axios from "axios";
import { Button, Divider, Grid, Menu, Table } from "semantic-ui-react";
import { dbURL, serverUrl } from "../../config.json";

class Delivery extends Component {
  constructor() {
    super();
    this.state = {
      deliveryID: "",
      name: "",
      token: "",
      ordersByDelivery: [],
      readyOrders: [],
      ordersTable: [],
      readyTable: [],
      orderID: "",
      redirect: false,
      method: ""
    };
  }

  componentDidMount = () => {
    // get the token from the local storage
    const token = localStorage.getItem("deliveryToken");

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

      // set the state of token, name, and deliveryID
      this.setState({ token, name, deliveryID: userID });

      // set the axios default header to token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // call the getOrderList
      this.getOrderList();

      this.getReadyOrders();
    }

    // set the notification method
    this.setState({ method: process.env.REACT_APP_METHOD });
  };

  getOrderList = async () => {
    const orders = await axios.get(`${dbURL}/getOrdersByDelivery`);

    this.setState(
      {
        ordersByDelivery: orders.data
      },
      () => {
        this.createOrderTable();
      }
    );
  };

  getReadyOrders = async () => {
    const orders = await axios.get(`${dbURL}/getOrdersByStatus/order_ready`);

    if (orders.data != null) {
      this.setState(
        {
          readyOrders: orders.data
        },
        () => {
          this.createReadyTable();
        }
      );
    } else {
      this.setState(
        {
          readyOrders: []
        },
        () => {
          this.createReadyTable();
        }
      );
    }
  };

  changeOrderStatus = async (orderID, orderStatus) => {
    const res = await axios.put(
      `${dbURL}/updateOrderStatus/${orderID}/${orderStatus}`
    );

    console.log(res);

    if (res.status) {
      this.sendNotification(orderID);
    }

    this.getOrderList();
    this.getReadyOrders();
  };

  orderPicked = async orderID => {
    const res = await axios.put(`${dbURL}/orderPicked/${orderID}`);

    console.log(res);

    if (res.status) {
      this.sendNotification(orderID);
    }

    this.getOrderList();
    this.getReadyOrders();
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

  createOrderTable = () => {
    const { ordersByDelivery } = this.state;

    if (ordersByDelivery != null) {
      const table = ordersByDelivery.map((order, index) => {
        return (
          <Table.Row key={index}>
            <Table.Cell>{order.orderID}</Table.Cell>
            <Table.Cell>{order.itemID}</Table.Cell>
            <Table.Cell>{order.merchantID}</Table.Cell>
            <Table.Cell>{order.deliveryID}</Table.Cell>
            <Table.Cell>{order.customerID}</Table.Cell>
            <Table.Cell>{order.orderStatus}</Table.Cell>
            <Table.Cell>
              <Button
                color="green"
                onClick={() =>
                  this.changeOrderStatus(order.orderID, "delivered")
                }
              >
                Delivered
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

  createReadyTable = () => {
    const { readyOrders } = this.state;

    if (readyOrders != null) {
      const table = readyOrders.map((order, index) => {
        return (
          <Table.Row key={index}>
            <Table.Cell>{order.orderID}</Table.Cell>

            <Table.Cell>{order.orderStatus}</Table.Cell>
            <Table.Cell>
              <Button
                color="green"
                onClick={() => this.orderPicked(order.orderID)}
              >
                Order Picked
              </Button>
            </Table.Cell>
          </Table.Row>
        );
      });

      this.setState({
        readyTable: table
      });
    }
  };

  logout = () => {
    // clear the token from the storage
    localStorage.removeItem("deliveryToken");

    // redirect to the dashboard
    this.setState({ redirect: true });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/"></Redirect>;
    }
  };

  render() {
    const { deliveryID, name } = this.state;

    return (
      <div>
        {this.renderRedirect()}

        <Menu secondary>
          <Menu.Item>{name}</Menu.Item>
          <Menu.Item>{deliveryID}</Menu.Item>
          <Menu.Item position="right">
            <Button onClick={() => this.logout()} color="black">
              Logout
            </Button>
          </Menu.Item>
        </Menu>

        <Divider horizontal>Orders</Divider>
        <div className="delivery-table">
          <Grid columns={2} divided>
            <Grid.Column width={11}>
              <Table color="brown">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Order ID</Table.HeaderCell>
                    <Table.HeaderCell>Item ID</Table.HeaderCell>
                    <Table.HeaderCell>Merchant ID</Table.HeaderCell>
                    <Table.HeaderCell>Delivery ID</Table.HeaderCell>
                    <Table.HeaderCell>Customer ID</Table.HeaderCell>
                    <Table.HeaderCell>Order Status</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{this.state.ordersTable}</Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column width={5}>
              <Table color="brown">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Order ID</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{this.state.readyTable}</Table.Body>
              </Table>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Delivery;
