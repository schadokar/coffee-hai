import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";

class Orders extends Component {
  constructor() {
    super();
    this.state = {
      orders: [],
      ordersTable: [],
      btnStatement: ""
    };
  }

  // Set the orders and orderStatus in the state
  // from the passed props
  componentDidMount = () => {
    this.setState(
      {
        orders: this.props.orders,
        btnStatement: this.props.btnStatement
      },
      () => this.createOrderTable()
    );
  };

  // create order table of the merchant
  createOrderTable = () => {
    const { orders } = this.state;

    let btnColor = this.props.btnColor || "green";

    if (orders) {
      const table = orders.map((order, index) => (
        <Table.Row key={index}>
          <Table.Cell>{order.orderID}</Table.Cell>
          <Table.Cell>{order.itemID}</Table.Cell>
          <Table.Cell>{order.merchantID}</Table.Cell>
          <Table.Cell>{order.deliveryID}</Table.Cell>
          <Table.Cell>{order.customerID}</Table.Cell>
          <Table.Cell>{order.orderStatus}</Table.Cell>
          <Table.Cell>
            <Button
              color={btnColor}
              onClick={() => this.props.changeOrderStatus(order.orderID)}
            >
              {this.state.btnStatement}
            </Button>
          </Table.Cell>
        </Table.Row>
      ));

      this.setState({
        ordersTable: table
      });
    }
  };

  render() {
    return (
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
    );
  }
}

export default Orders;
