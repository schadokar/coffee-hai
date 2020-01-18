import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./merchant.css";
import axios from "axios";
import { Menu, Button, Segment, Grid } from "semantic-ui-react";
import { dbURL, serverUrl } from "../../config.json";
// Form to create an item
import { ItemForm } from "../Forms/index.js";
// import Item table
import { ItemsByMerchant } from "../Items/index";
// import Orders Table
import { Orders } from "../Orders/index";

class Merchant extends Component {
  constructor() {
    super();
    this.state = {
      merchantID: "",
      name: "",
      token: "",
      orders: [],
      redirect: false,
      method: "",
      activeItem: "items",
      orderStatus: "order_ready"
    };
  }

  // handle Menu item click
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  // use jwt to extract the merchant details
  componentDidMount = () => {
    // get the token from the local storage
    const token = localStorage.getItem("merchantToken");

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

      // set the state of token, name, and merchantID
      this.setState({ token, name, merchantID: userID });

      // set the axios default header to token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // call the getOrderList
      this.getOrderList();
    }

    // set the notification method
    this.setState({ method: process.env.REACT_APP_METHOD });
  };

  // get orders for the merchant
  getOrderList = async () => {
    const orders = await axios.get(`${dbURL}/getOrdersByMerchant`);
    console.log(orders.data);

    this.setState({
      orders: orders.data
    });
  };

  // change order status from order_placed to order_ready
  changeOrderStatus = async orderID => {
    // update the status of the order to order_ready
    const res = await axios.put(
      `${dbURL}/updateOrderStatus/${orderID}/order_ready`
    );

    // if order status successfully updated
    // then send notification to merchant and customer
    if (res.status) {
      this.sendNotification(orderID);
    }

    console.log(res);

    this.getOrderList();
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

  logout = () => {
    // clear the token from the storage
    localStorage.removeItem("merchantToken");

    // redirect to the dashboard
    this.setState({ redirect: true });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/"></Redirect>;
    }
  };

  // return the table of orders or items w.r.t to selected option
  selectedTab = () => {
    switch (this.state.activeItem) {
      case "orders":
        return (
          <Orders
            orders={this.state.orders}
            btnStatement={"Order Ready"}
            changeOrderStatus={this.changeOrderStatus}
          />
        );
      case "items":
        return <ItemsByMerchant />;
      default:
        return <ItemsByMerchant />;
    }
  };

  render() {
    const { merchantID, name, activeItem } = this.state;

    return (
      <div>
        {this.renderRedirect()}
        <Menu secondary>
          <Menu.Item>{name}</Menu.Item>
          <Menu.Item>{merchantID}</Menu.Item>

          <Menu.Item position="right">
            <ItemForm
              merchantID={merchantID}
              getOrderList={this.getOrderList}
            ></ItemForm>
          </Menu.Item>
          <Menu.Item>
            <Button onClick={() => this.logout()} color="black">
              Logout
            </Button>
          </Menu.Item>
        </Menu>
        {/* <Divider horizontal>Orders</Divider> */}

        <Grid>
          <Grid.Column width={3}>
            <Menu fluid vertical tabular>
              <Menu.Item
                name="items"
                active={activeItem === "items"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="orders"
                active={activeItem === "orders"}
                onClick={this.handleItemClick}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column width={13}>
            <Segment>{this.selectedTab()}</Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Merchant;
