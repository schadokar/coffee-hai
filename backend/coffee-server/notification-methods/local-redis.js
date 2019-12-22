require("dotenv").config();
const getOrderDetails = require("./get-order-details");

const sendNotification = async (orderID, bearerToken) => {
  const res = await getOrderDetails(orderID, bearerToken);
  // console.log(res);
  try {
    if (res.status) {
      let promises = [];

      res.payload.forEach(to => {
        const sendNotificationPromise = new Promise((resolve, reject) => {
          try {
            resolve({
              status: true,
              payload: `${to}: ${res.message}`,
              error: null
            });
          } catch (error) {
            reject({
              status: false,
              payload: "Unable to send the notification",
              error: error
            });
          }
        });

        // add the promise in the promises array
        promises.push(sendNotificationPromise);
      });

      return {
        status: true,
        payload: await Promise.all(promises),
        error: null
      };
    } else {
      throw new Error(res.error);
    }
  } catch (error) {
    return {
      status: false,
      payload: "Unable to send notification to the actors.",
      error
    };
  }
};

module.exports = { sendNotification };
