const mongoose = require("mongoose");
const { Schema } = mongoose;

const requests = new Schema(
  {
    ipaddress: {
      type: String,
      required: "Ip address is required",
    },

    country: {
      type: String,
      required: "country is required",
    },

    count: {
      type: Number,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Requests = mongoose.model("requests", requests);
module.exports = Requests;
