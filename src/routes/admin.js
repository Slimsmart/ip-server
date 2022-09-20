const express = require("express");
const {
  createUser,
  login,
  logout,
  isAuth,
  me,
} = require("../controllers/admin");
const { validateUser } = require("../middleware");
const router = express.Router();

router.post("/admin/login", validateUser, login);

router.post("/admin/create", validateUser, createUser);

router.get("/admin/me", isAuth, me);

router.post("/admin/logout", logout);

module.exports = router;
