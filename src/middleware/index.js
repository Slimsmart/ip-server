const axios = require("axios");
const { validateEmail } = require("../utils");

module.exports = {
  validate(req, res, next) {
    try {
      const { ip = null, apikey = null } = req.body;
      if (!apikey) {
        throw new Error("apikey missing from request.");
      }
      //check for matching values
      if (ip) {
        const isvalidIp = isMatchFor("ipaddress", ip);
        if (!isvalidIp) {
          throw new Error("enter a valid ip address");
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  validateUser(req, res, next) {
    try {
      const { email, password, firstName = null, lastName = null } = req.body;

      if (firstName !== null && lastName !== null) {
        if (!firstName) {
          throw new Error("firstName cannot be empty.");
        }

        if (!lastName) {
          throw new Error("lastName cannot be empty.");
        }
      }
      if (!email) {
        throw new Error("email cannot be empty.");
      }
      if (!password) {
        throw new Error("password cannot be empty.");
      }
      const isEmail = validateEmail(email);

      if (!isEmail) {
        throw new Error("Enter a valid email");
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};

function isMatchFor(name, value) {
  const regex = {
    ipaddress: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
  };
  return regex[name].test(value);
}
