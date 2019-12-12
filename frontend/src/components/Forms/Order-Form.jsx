import React, { Component } from "react";
import axios from "axios";
import { dbURL } from "../../config.json";
import { Button, Input, Modal, Form } from "semantic-ui-react";

class ModalModalExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      merchantID: this.props.merchantID,
      customerID: this.props.customerID,
      orderStatus: "order_created",
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

    this.props.getOrderList();
  };

  createOrder = async () => {
    const { orderID, merchantID, customerID, orderStatus } = this.state;

    this.setState({
      loading: true
    });

    const res = await axios.post(`${dbURL}/createOrder`, {
      orderID: orderID,
      merchantID: merchantID,
      customerID: customerID,
      deliveryID: null,
      orderStatus: orderStatus
    });
    console.log(res);

    this.toggleModal();
  };

  render() {
    const {
      orderID,
      merchantID,
      customerID,
      orderStatus,
      open,
      loading
    } = this.state;

    return (
      <Modal
        open={open}
        trigger={
          <Button color="linkedin" onClick={() => this.generateOrderID()}>
            Create Order
          </Button>
        }
      >
        <Modal.Header>Create Order</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Order ID</label>
                <Input placeholder={orderID} readOnly></Input>
              </Form.Field>
              <Form.Field>
                <label>Merchant ID</label>
                <Input placeholder={merchantID} readOnly></Input>
              </Form.Field>

              <Form.Field>
                <label>Customer ID</label>
                <Input placeholder={customerID} readOnly></Input>
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

export default ModalModalExample;
