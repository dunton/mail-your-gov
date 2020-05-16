const mongoose = require("mongoose"); // import mongoose
const { Schema } = mongoose; // get Schema from mongoose

// create schema for collection
const legislatorSchema = new Schema({
  email: String,
  state: String,
  district: String,
  name: String,
  emailsReceived: { type: Number, default: 0 },
});

mongoose.model("legislators", legislatorSchema);
