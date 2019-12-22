require("dotenv").config();
const mysqlDBURL = process.env.MYSQL_DB_URL;
const axios = require("axios");

const getOrderDetails = async (orderID, bearerToken) => {
  try {
    // set the axios default header to token
    axios.defaults.headers.common["Authorization"] = bearerToken;

    const res = await axios.get(`${mysqlDBURL}/getOrder/${orderID}`);

    if (res.status) {
      let actors = [];

      const { merchantID, customerID, orderStatus } = res.data;

      // check if merchant is not empty
      if (merchantID !== "") {
        actors.push(merchantID);
      }
      // check if customer is not empty
      if (customerID !== "") {
        actors.push(customerID);
      }

      return {
        status: true,
        payload: actors,
        message: `Order ${orderID} status changed to ${orderStatus}`,
        error: null
      };
    } else {
      throw new Error("Unable to get the order details");
    }
  } catch (error) {
    // console.log(error);
    return {
      status: false,
      payload: "Unable to fetch actors.",
      error
    };
  }
};

module.exports = getOrderDetails;
