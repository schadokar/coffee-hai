import React, { Component } from "react";
import axios from "axios";
import { dbURL } from "../../config.json";
import { Button, Input, Modal, Form } from "semantic-ui-react";

class ItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemID: "",
      name: "",
      open: false,
      loading: false
    };
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  generateItemID = () => {
    this.setState({
      itemID: `I${Math.floor(Math.random() * 10000)}`
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

  createItem = async () => {
    const { itemID, name } = this.state;

    this.setState({
      loading: true
    });

    const res = await axios.post(`${dbURL}/createItem`, {
      itemID: itemID,
      name: name
    });
    console.log(res);

    if (res.status) {
      // call getOrderList in the parent to refresh the
      // order list
      this.props.getOrderList();
    }
    this.toggleModal();
  };

  render() {
    const { itemID, open, loading } = this.state;

    return (
      <Modal
        open={open}
        trigger={
          <Button color="linkedin" onClick={() => this.generateItemID()}>
            Create Item
          </Button>
        }
      >
        <Modal.Header>Create Item</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Item ID</label>
                <Input placeholder={itemID} readOnly></Input>
              </Form.Field>
              <Form.Field>
                <label>Merchant ID</label>
                <Input placeholder={this.props.merchantID} readOnly></Input>
              </Form.Field>

              <Form.Field>
                <label>Name</label>
                <Input
                  onChange={this.onChange}
                  placeholder="Item Name"
                  name="name"
                  value={this.state.name}
                ></Input>
              </Form.Field>

              <Button
                loading={loading}
                primary
                onClick={() => {
                  this.createItem();
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

export default ItemForm;
