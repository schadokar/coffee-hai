import React, { Component } from "react";
import "./merchant.css";
import OrderForm from "../Forms/index";
import axios from "axios";
import { Menu, Button, Divider, Table } from "semantic-ui-react";
import { dbURL } from "../../config.json";

class Merchant extends Component {
  constructor() {
    super();
    this.state = {
      merchantID: "M108",
      orders: [],
      ordersTable: [],
      orderID: "",
      deliveryID: "",
      customerID: "C101",
      orderStatus: "created"
    };
  }

  message = () => {
    console.log("message");
  };
  componentDidMount = () => {
    this.getOrderList();
  };

  getOrderList = async () => {
    const { merchantID } = this.state;
    const orders = await axios.get(
      `${dbURL}/getOrdersByMerchant/${merchantID}`
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
      `${dbURL}/updateOrderStatus/${orderID}/order_ready`
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

  render() {
    return (
      <div>
        <Menu secondary>
          <Menu.Item>
            <OrderForm
              merchantID="M108"
              customerID="C101"
              getOrderList={this.getOrderList}
            ></OrderForm>

            {/* <Button primary>Create Order</Button> */}
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
