const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!validator.isStrongPassword(password)) {
      console.log("aaya tha yha");
      throw new Error("Password isn't strong enough Enter Strong Password");
    }
    const encryptedpass = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: encryptedpass,
    });
    await user.save();
    
    res.send("Sign you up successfully ");
  } catch (e) {
    console.log(e.message);
    res.status(400).send("Error in Signing you up !" + e.message);
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("email not found");
    }
    const isPassMatched = await bcrypt.compare(password, user.password);
    if (!isPassMatched) {
      throw new Error("Password Not Matched");
    }
    const token = user.getJWT();
    res.cookie("token", token).send("Login Successfull");
  } catch (e) {
    console.log("Error : ", e.message);
    res.status(400).send("Error while loggin you in " + e.message);
  }
});

authRouter.get("/logout", (req, res) => {
  try {
  } catch (e) {
    console.log("Error ", e.message);
    res.status(400).send("Error while loggin you out" + e.message);
  }
  res.clearCookie("token");
  res.send("Logout Successfull");
});

module.exports = { authRouter };
