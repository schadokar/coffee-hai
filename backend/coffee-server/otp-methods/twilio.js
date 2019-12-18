require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceName = process.env.TWILIO_COFFEE_SERVICE;

// create client
const client = require("twilio")(accountSid, authToken);

// send otp using the twilio service
const sendOTP = async mobileno => {
  try {
    return new Promise((resolve, reject) => {
      client.verify
        .services(serviceName)
        .verifications.create({ to: mobileno, channel: "sms" })
        .then(verification => {
          console.log(verification.status);

          resolve({
            status: true,
            verificationStatus: verification.status,
            payload: "Sms sent",
            error: null
          });
        })
        .catch(e => {
          console.error("Something went wrong", e);
          reject({
            status: false,
            verificationStatus: false,
            payload: "Something went wrong while sending the sms using twilio",
            error: error
          });
        });
    });
  } catch (error) {
    return {
      status: false,
      verificationStatus: false,
      payload: "Something went wrong while sending the sms using twilio",
      error: error
    };
  }
};

// verify the otp using the twilio service
const verifyOTP = async (mobileno, otp) => {
  try {
    return new Promise((resolve, reject) => {
      client.verify
        .services(serviceName)
        .verificationChecks.create({ to: mobileno, code: otp.toString() })
        .then(verification_check => {
          console.log(verification_check.status);

          resolve({
            status: true,
            verificationStatus: verification_check.status,
            payload: "number verified",
            error: null
          });
        })
        .catch(e => {
          console.error("Something went wrong", e);
          reject({
            status: false,
            verificationStatus: false,
            payload:
              "Something went wrong while verifying the sms using twilio",
            error: error
          });
        });
    });
  } catch (error) {
    return {
      status: false,
      verificationStatus: false,
      payload: "Something went wrong while verifying the sms using twilio",
      error: error
    };
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
