require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const authenticateAPI = require("./routes/authenticate-api.js");

// Express body parser
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 50000
  })
);

// use the routes specified in route folder
app.use("/api/v1", authenticateAPI);

const port = process.env.PORT || 4444;
//listen to the server
app.listen(port, function() {
  console.log(`listening to the port ${port} .....`);
});
