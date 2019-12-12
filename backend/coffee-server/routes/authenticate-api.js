const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Send OTP route

router.post("/sendotp", (req, res) => {
  const { mobileno } = req.body;
  try {
    // call api to get the OTP

    res.send({
      status: true,
      payload: "Request Sent Successfully!"
    });
  } catch (error) {
    res.send({
      status: false,
      payload: "Unable to get the OTP"
    });
  }
});

// Verify OTP

router.post("/verifyotp", (req, res) => {
  const { otp } = req.body;

  try {
    // call api to verify otp
    const user = {
      userID: "M101",
      name: "Shubham"
    };

    jwt.sign({ user }, "secretkey", (err, token) => {
      res.json({
        token,
        status: true,
        payload: true
      });
    });
  } catch (error) {
    res.send({
      status: false,
      payload: "Unable to verify the OTP"
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
