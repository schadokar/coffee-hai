const localRedis = require("./local-redis");

module.exports = {
  redisSendOTP: localRedis.redisSendOTP,
  redisVerifyOTP: localRedis.redisVerifyOTP
};
