const localRedis = require("./local-redis");
const twilioOTP = require("./twilio");

// send OTP according to the method
const sendOTP = async (mobileno, method) => {
  switch (method) {
    case "local-redis":
      return await localRedis.redisSendOTP(mobileno);
    case "twilio":
      return await twilioOTP.sendOTP(mobileno);
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
      return await localRedis.redisVerifyOTP(mobileno, otp);
    case "twilio":
      return await twilioOTP.verifyOTP(mobileno, otp);
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
