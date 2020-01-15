require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const otpMethod = require("../otp-methods");
const notificationMethod = require("../notification-methods");

// import the dburl from the env variable
const dbURL = process.env.MYSQL_DB_URL;

// Send OTP route
router.post("/sendotp", async (req, res) => {
  const { mobileno, method } = req.body;

  try {
    // call api to get the OTP
    const result = await otpMethod.sendOTP(mobileno, method);

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
  const { otp, mobileno, name, actor, method } = req.body;

  try {
    // call api to verify otp
    const result = await otpMethod.verifyOTP(mobileno, otp, method);

    if (result.status) {
      const user = { userID: mobileno, name };

      // sign the jwt token with the userID and name
      jwt.sign({ user }, "secretkey", async (err, token) => {
        if (err) throw err;

        // save user in the db if not exist
        const dbres = await axios.post(`${dbURL}/signIn${actor}`, {
          userID: mobileno,
          name: name
        });

        console.log(dbres.data);

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
router.post("/sendnotification", async (req, res) => {
  const { orderID, method } = req.body;
  const bearerToken = req.headers["authorization"];

  try {
    const result = await notificationMethod.sendNotification(
      orderID,
      method,
      bearerToken
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
