const axios = require("axios");
const endpoint = "http://localhost:5000";
/**
 *
 * @param {string} mobileNo - mobileno of the user
 */
const redisSendOTP = async mobileNo => {
  // generate a 4 digit otp
  const otp = generateOTP();

  console.log(otp);

  // set the otp to mobileno
  const result = await axios.post(`${endpoint}/set`, {
    key: mobileNo,
    value: otp.toString()
  });

  console.log(result.status);

  return { status: true, payload: "OTP sent successfully!" };
};

/**
 * Verify the OTP sent to the user
 * @param {string} mobileNo - mobileno of the user
 * @param {number} otp - otp enter by the user
 */
const redisVerifyOTP = async (mobileNo, otp) => {
  try {
    const sentOTP = await axios.get(`${endpoint}/get/${mobileNo}`);

    if (parseInt(sentOTP.data) === parseInt(otp)) {
      return {
        status: true,
        payload: "OTP Matched"
      };
    } else {
      return {
        status: false,
        payload: "Invalid OTP"
      };
    }
  } catch (error) {
    return {
      status: false,
      payload: "Something went Wrong!",
      error: error
    };
  }
};
/*
 *  Math.random() will generate a floating point number in the range [0, 1)
 *  (note that 1 is excluded from the range).
 *  Multiplying by 9000 results in a range of [0, 9000).
 *  Adding 1000 results in a range of [1000, 10000).
 *  Flooring chops off the decimal value to give you an integer. Note that it does not round.
 */
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

module.exports = { redisSendOTP, redisVerifyOTP };
