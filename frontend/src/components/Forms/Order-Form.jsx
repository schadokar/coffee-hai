import React, { Component } from "react";
import axios from "axios";
import { dbURL } from "../../config.json";
import { Button, Input, Modal, Form } from "semantic-ui-react";

class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: "order_placed",
      orderID: "",
      open: false,
      loading: false
    };
  }

  generateOrderID = () => {
    this.setState({
      orderID: `O${Math.floor(Math.random() * 10000)}`
    });
    this.toggleModal();
  };

  // Open or close the modal(pop-up) form
  toggleModal = () => {
    if (this.state.open) {
      this.setState({
        open: false,
        loading: false
      });
    } else {
      this.setState({
        open: true,
        loading: false
      });
    }
  };

  createOrder = async () => {
    const { orderID, orderStatus } = this.state;

    this.setState({
      loading: true
    });
    console.log(
      orderID,
      this.props.merchantID,
      this.props.customerID,
      this.props.itemID,
      orderStatus
    );
    const res = await axios.post(`${dbURL}/createOrder`, {
      orderID: orderID,
      merchantID: this.props.merchantID,
      customerID: this.props.customerID,
      deliveryID: null,
      itemID: this.props.itemID,
      orderStatus: orderStatus
    });
    console.log(res);

    // if (res.status) {
    //   // call getOrderList in the parent to refresh the
    //   // order list
    //   this.props.getOrderList();
    //   this.props.sendNotification(orderID);
    // }
    this.toggleModal();
  };

  render() {
    const { orderID, orderStatus, open, loading } = this.state;

    return (
      <Modal
        open={open}
        trigger={
          <Button color="linkedin" onClick={() => this.generateOrderID()}>
            Buy Coffee
          </Button>
        }
      >
        <Modal.Header>Buy Coffee</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Order ID</label>
                <Input placeholder={orderID} readOnly></Input>
              </Form.Field>
              <Form.Field>
                <label>Merchant ID</label>
                <Input placeholder={this.props.merchantID} readOnly></Input>
              </Form.Field>

              <Form.Field>
                <label>Customer ID</label>
                <Input placeholder={this.props.customerID} readOnly></Input>
              </Form.Field>
              <Form.Field>
                <label>Order Status</label>
                <Input placeholder={orderStatus} readOnly></Input>
              </Form.Field>
              <Button
                loading={loading}
                primary
                onClick={() => {
                  this.createOrder();
                }}
              >
                Create
              </Button>
              <Button
                color="red"
                onClick={() => {
                  this.toggleModal();
                }}
              >
                Cancel
              </Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default CreateOrder;
