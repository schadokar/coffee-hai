import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import axios from "axios";
import { OrderForm } from "../Forms/index";
import { dbURL } from "../../config.json";

// return table of items
class Items extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      itemsTable: []
    };
  }

  // get the items by merchant Id
  componentDidMount = async () => {
    // get the token from the local storage
    const token = this.props.token;

    // set the axios default header to token
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.get(`${dbURL}/getAllItems`);

    this.setState({
      items: res.data
    });

    this.createItemsTable();
  };

  // Create item table
  createItemsTable = () => {
    const { customerID } = this.props;
    console.log("This is customer id", customerID);
    let itemsTable = [];
    if (this.state.items) {
      itemsTable = this.state.items.map(item => (
        <Table.Row key={item.itemID}>
          <Table.Cell>{item.itemID}</Table.Cell>
          <Table.Cell>{item.name}</Table.Cell>
          <Table.Cell>{item.merchantID}</Table.Cell>
          <Table.Cell>
            <OrderForm
              merchantID={item.merchantID}
              customerID={customerID}
              itemID={item.itemID}
            ></OrderForm>
          </Table.Cell>
        </Table.Row>
      ));
    }

    this.setState({
      itemsTable
    });
  };

  // order Item - call the order item component and
  // pass all the required params
  orderItem = (customerID, merchantID) => {
    return (
      <OrderForm merchantID={merchantID} customerID={customerID}></OrderForm>
    );
  };

  render() {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Item ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Merchant ID</Table.HeaderCell>
            <Table.HeaderCell>Buy Item</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.state.itemsTable}</Table.Body>
      </Table>
    );
  }
}

export default Items;
