const express = require("express");
const userAuth = express.Router();
const {UserModel} = require("../models/user");
const jwt = require("jsonwebtoken");



userAuth.use(async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const {_id} = jwt.verify(token, "Secretkey@123");
    if (!_id) {
      throw new Error("Invalid jwt");
    }
    const user = await UserModel.findById(_id);
    req.user = user;
    next();
  } catch (e) {
    res.status(200).send("Error in verifing you ! " + e.message);
  }
});

module.exports = userAuth;
