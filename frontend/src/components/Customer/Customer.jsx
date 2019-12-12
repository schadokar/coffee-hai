import React, { Component } from "react";
import "./customer.css";
import axios from "axios";
import { Button, Divider, Table } from "semantic-ui-react";
import { dbURL } from "../../config.json";

class Customer extends Component {
  constructor() {
    super();
    this.state = {
      customerID: "C101",
      orders: [],
      ordersTable: [],
      orderStatus: "created"
    };
  }

  componentDidMount = () => {
    this.getOrderList();
  };

  getOrderList = async () => {
    const { customerID } = this.state;
    const orders = await axios.get(
      `${dbURL}/getOrdersByCustomer/${customerID}`
    );

    this.setState(
      {
        orders: orders.data
      },
      () => {
        this.createOrderTable();
      }
    );
  };

  changeOrderStatus = async orderID => {
    const res = await axios.put(
      `${dbURL}/updateOrderStatus/${orderID}/cancelled`
    );

    console.log(res);

    this.getOrderList();
  };

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
                color="red"
                onClick={() => this.changeOrderStatus(order.orderID)}
              >
                Cancel
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

  render() {
    return (
      <div>
        <Divider horizontal>Orders</Divider>
        <div className="customer-table">
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

export default Customer;
