require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();

const authenticateAPI = require("./routes/authenticate-api.js");

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// use the routes specified in route folder
app.use("/api/v1", authenticateAPI);

const port = process.env.PORT || 4444;
//listen to the server
app.listen(port, function() {
  console.log(`listening to the port ${port} .....`);
});
