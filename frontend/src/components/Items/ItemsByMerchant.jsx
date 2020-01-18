import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import axios from "axios";
import { dbURL } from "../../config.json";

// return table of items created/own by a merchant
class ItemsByMerchant extends Component {
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
    const token = localStorage.getItem("merchantToken");

    // set the axios default header to token
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.get(`${dbURL}/getItemsByMerchant`);

    this.setState({
      items: res.data
    });

    this.createItemsTable();
  };

  // Create item table
  createItemsTable = () => {
    const { items } = this.state;

    if (items) {
      const itemsTable = this.state.items.map(item => (
        <Table.Row key={item.itemID}>
          <Table.Cell>{item.itemID}</Table.Cell>
          <Table.Cell>{item.name}</Table.Cell>
          <Table.Cell>{item.merchantID}</Table.Cell>
        </Table.Row>
      ));

      this.setState({
        itemsTable
      });
    }
  };

  render() {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Item ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Merchant ID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.state.itemsTable}</Table.Body>
      </Table>
    );
  }
}

export default ItemsByMerchant;
