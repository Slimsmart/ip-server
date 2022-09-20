const User = require("../models/users");
const {
  hashPassword,
  comparePasswords,
  responseWithCode,
} = require("../utils");

const PassedRequests = require("../models/requests");
const FailedRequests = require("../models/FailedRequests");

module.exports = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return responseWithCode(res, `user does not exist!`, 404);
      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) {
        responseWithCode(res, `incorrect email or password combination`, 401);
      } else {
        req.session.isLoggedIn = true;
        req.session.email = email;
        responseWithCode(res, "successfully logged in", 200);
      }
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      const user = User({
        ...req.body,
        password: hashPassword(req.body.password),
      });
      await user.save();
      return res.status(201).json({ message: "created" });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      req.session.destroy((error) => {
        if (error) throw new Error(error.message);
      });
      return responseWithCode(res, "logged out successfully", 200);
    } catch (error) {
      next(error);
    }
  },

  async isAuth(req, res, next) {
    try {
      if (req.session.isLoggedIn) {
        next();
      } else {
        req.session.destroy((error) => {
          if (error) throw new Error(error.message);
        });
        return responseWithCode(res, "user not authorized", 401);
      }
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email });

      const passed = await PassedRequests.aggregate([
        {
          $group: {
            _id: "",
            count: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            TotalAmount: "$count",
          },
        },
      ]);

      const failed = await FailedRequests.findOne({ count: { $ne: 0 } });

      const record = await PassedRequests.find().sort({ count: -1 }).limit(1);

      const ip = record.length ? record[0].ipaddress : "no value yet.";

      if (!user) {
        req.session.destroy((error) => {
          if (error) throw new Error(error.message);
        });
        return responseWithCode(res, "user not found", 404);
      }
      return responseWithCode(res, "success!", 200, {
        user,
        failed,
        passed,
        highestSearchIp: ip,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
