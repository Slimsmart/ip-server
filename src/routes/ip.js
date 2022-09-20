const express = require("express");
const { getipDetails } = require("../controllers/ip");
const { validate } = require("../middleware");
const router = express.Router();

router.post("/ip", validate, getipDetails);

module.exports = router;
