const axios = require("axios").default;
const BASE_URL = process.env.BASE_URL;
const { flattenObj } = require("../utils");
const Requests = require("../models/requests");
const FailedRequests = require("../models/FailedRequests");

module.exports = {
  async getipDetails(req, res, next) {
    const { ip, apikey } = req.body;

    try {
      const ipClause = `?${ip ? "ip=" + ip + "&" : ""}`;
      const {
        data: { data },
      } = await axios.get(`${BASE_URL}/${ipClause}apikey=${apikey}`);

      const record = await Requests.updateOne(
        {
          ipaddress: ip,
          country: data.location.country.name,
          count: { $gt: 0 },
        },
        { $inc: { count: 1 } },
        { upsert: true }
      );

      return res.status(200).json({
        message: "success!",
        data: { ...data, location: flattenObj(data.location) },
      });
    } catch (error) {
      const record = await FailedRequests.updateOne(
        {
          count: { $gt: 0 },
        },
        { $inc: { count: 1 } },
        { upsert: true }
      );
      next(error);
    }
  },
};
