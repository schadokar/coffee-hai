const localRedis = require("./local-redis");

// send notification according to the method
const sendNotification = async (orderID, method, bearerToken) => {
  switch (method) {
    case "local-redis":
      return await localRedis.sendNotification(orderID, bearerToken);
    default:
      return {
        status: false,
        payload: "Please select a valid method: local-redis, messagebird"
      };
  }
};

module.exports = { sendNotification };
