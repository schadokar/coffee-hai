import React, { Component } from "react";
import "./delivery.css";

import axios from "axios";
import { Button, Divider, Grid, Table } from "semantic-ui-react";
import { dbURL } from "../../config.json";

class Delivery extends Component {
  constructor() {
    super();
    this.state = {
      deliveryID: "D102",
      ordersByDelivery: [],
      readyOrders: [],
      ordersTable: [],
      readyTable: [],
      orderID: ""
    };
  }

  componentDidMount = () => {
    this.getOrderList();
    this.getReadyOrders();
  };

  getOrderList = async () => {
    const { deliveryID } = this.state;

    const orders = await axios.get(
      `${dbURL}/getOrdersByDelivery/${deliveryID}`
    );

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

    this.getOrderList();
    this.getReadyOrders();
  };

  orderPicked = async orderID => {
    const { deliveryID } = this.state;

    const res = await axios.put(
      `${dbURL}/orderPicked/${orderID}/${deliveryID}`
    );

    console.log(res);

    this.getOrderList();
    this.getReadyOrders();
  };

  createOrderTable = () => {
    const { ordersByDelivery } = this.state;

    if (ordersByDelivery != null) {
      const table = ordersByDelivery.map((order, index) => {
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

  render() {
    return (
      <div>
        <Divider horizontal>Orders</Divider>
        <div className="delivery-table">
          <Grid columns={2} divided>
            <Grid.Column width={11}>
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
