require("dotenv").config();

const sendNotification = async (from, to, message) => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        status: true,
        payload: `${from} - ${message} - ${to}`,
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
};

module.exports = { sendNotification };
