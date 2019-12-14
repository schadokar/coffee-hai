const localRedis = require("./local-redis");

// send OTP according to the method
const sendOTP = async (mobileno, method) => {
  switch (method) {
    case "local-redis":
      return localRedis.redisSendOTP(mobileno);

    default:
      return {
        status: false,
        payload:
          "Please select a valid method: local-redis, sendgrid, messagebird, twilio"
      };
  }
};

// verify the OTP according to the method
const verifyOTP = async (mobileno, otp, method) => {
  switch (method) {
    case "local-redis":
      return localRedis.redisVerifyOTP(mobileno, otp);

    default:
      return {
        status: false,
        payload:
          "Please select a valid method: local-redis, sendgrid, messagebird, twilio"
      };
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
