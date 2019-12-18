const localRedis = require("./local-redis");

// send notification according to the method
const sendNotification = async (from, to, message, method) => {
  switch (method) {
    case "local-redis":
      return await localRedis.sendNotification(from, to, message);
    default:
      return {
        status: false,
        payload: "Please select a valid method: local-redis, messagebird"
      };
  }
};

module.exports = { sendNotification };
