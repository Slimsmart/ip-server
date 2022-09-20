const mongoose = require("mongoose");
const { Schema } = mongoose;

const requests = new Schema(
  {
    count: {
      type: Number,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

const FailedRequests = mongoose.model("failedrequests", requests);
module.exports = FailedRequests;
