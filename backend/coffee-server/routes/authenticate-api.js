const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const otpMethod = require("../methods");

// Send OTP route
router.post("/sendotp", async (req, res) => {
  const { mobileno } = req.body;
  try {
    // call api to get the OTP
    const result = await otpMethod.redisSendOTP(mobileno);

    res.send({
      status: true,
      payload: result.payload
    });
  } catch (error) {
    res.send({
      status: false,
      payload: "Unable to get the OTP"
    });
  }
});

// Verify OTP
router.post("/verifyotp", async (req, res) => {
  const { otp, userID, name } = req.body;

  try {
    // call api to verify otp

    const result = await otpMethod.redisVerifyOTP(userID, otp);

    if (result.status) {
      const user = { userID, name };

      // sign the jwt token with the userID and name
      jwt.sign({ user }, "secretkey", (err, token) => {
        if (err) throw err;

        res.json({
          token,
          status: true,
          payload: result.payload
        });
      });
    } else {
      res.send({
        status: false,
        payload: result.payload
      });
    }
  } catch (error) {
    res.send({
      status: false,
      payload: "Unable to verify the OTP",
      error: error
    });
  }
});

// // Verify Token

// function verifyToken(req, res, next) {
//   // Get the auth header value
//   const bearerHeader = req.headers["authorization"];
//   // Check if bearer is undefined
//   if (typeof bearerHeader !== "undefined") {
//   } else {
//     // Forbidden
//     res.sendStatus(403);
//   }
// }

module.exports = router;
