const express = require("express");
const router = express.Router();

// Send OTP route

router.post("/sendotp", (req, res) => {
  const { mobileno } = req.body;
  try {
    // call api to get the OTP

    res.send({
      status: true,
      payload: 1234
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

    res.send({
      status: true,
      payload: true
    });
  } catch (error) {
    res.send({
      status: false,
      payload: "Unable to verify the OTP"
    });
  }
});

module.exports = router;
