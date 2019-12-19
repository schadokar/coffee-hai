const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const otpMethod = require("../otp-methods");
const notificationMethod = require("../notification-methods");

// Send OTP route
router.post("/sendotp", async (req, res) => {
  const { mobileno } = req.body;

  try {
    // call api to get the OTP
    const result = await otpMethod.sendOTP(mobileno, "twilio");

    if (result.status) {
      res.send({
        status: true,
        payload: result.payload
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
      payload: "Unable to get the OTP"
    });
  }
});

// Verify OTP
router.post("/verifyotp", async (req, res) => {
  const { otp, mobileno, name } = req.body;

  try {
    // call api to verify otp
    const result = await otpMethod.verifyOTP(mobileno, otp, "twilio");

    if (result.status) {
      const user = { userID: mobileno, name };

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
      payload: "Unable to verify the OTP"
    });
  }
});

// Send notification
router.post("/notification", async (req, res) => {
  const { from, to, message } = req.body;
  console.log(from, to, message);
  try {
    const result = await notificationMethod.sendNotification(
      from,
      to,
      message,
      "local-redis"
    );

    if (result.status) {
      res.json({
        status: true,
        payload: result.payload
      });
    } else {
      res.json({
        status: false,
        payload: result.payload
      });
    }
  } catch (error) {
    res.send({
      status: false,
      payload: "Failed to send notification!",
      error: error
    });
  }
});

module.exports = router;
