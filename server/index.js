require("dotenv").config();
const express = require("express"); // import express
const mongoose = require("mongoose"); // import mongoose
const cors = require("cors");
const bodyParser = require("body-parser"); // import body-parser
require("./models/Legislator"); // import in User model schema, so it executes

mongoose.connect(process.env.MONGO_URI);
const app = express(); // generate new express app

// bodyParser will parse every request incoming request to json
app.use(bodyParser.json());
app.use(cors());

// call authRoutes, billingRoutes functions
// returns function then immediately calls function with app object
require("./routes/")(app);

if (process.env.NODE_ENV === "production") {
  // EXPRESS will serve up production assets like our main.js or main.css file
  // handles from react router
  app.use(express.static("client/build"));
  // EXPRESS will serve up the index.html file if it doesnt recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
// tells NODE to listen on Port 5000
app.listen(PORT);
