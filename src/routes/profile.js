const express = require("express");
const mongoose = require("mongoose");
const userAuth = require("../middleware/auth");
const { RemainingModel, MasteredModel } = require("../models/userquestion");
const checkAuth = require("../middleware/checkAuth");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  res.send(req.user);
});

profileRouter.get("/profile/:random/:type", userAuth, async (req, res) => {
  try {
    const { type, random } = req.params;
    console.log(req.user);
    const { _id } = req.user;
    const allowedType = ["remaining", "mastered"];
    if (!allowedType.includes(type)) {
      throw new Error("There's no such type exist");
    }
    if (type === "remaining") {
      const data = await RemainingModel.find({ uid: _id }).populate("qid");
      if (random === "true") {
        const randomItem = data[Math.floor(Math.random() * data.length)];
        res.json({ data: randomItem });
      } else {
        res.json({ data });
      }
    } else {
      const data = await MasteredModel.find({ uid: _id }).populate("qid");
      if (random === "true") {
        const randomItem = data[Math.floor(Math.random() * data.length)];
        res.json({ data: randomItem });
      } else {
        res.json({ data });
      }
    }
  } catch (e) {
    res.json("Got the error " + e.message);
  }
});

profileRouter.post(
  "/profile/editDesc/:type/:_id",
  userAuth,
  async (req, res) => {
    try {
      const { type, _id } = req.params;
      const allowedType = ["remaining", "mastered"];
      if (!allowedType.includes(type)) {
        throw new Error("There's no such type exist");
      }
      if (type === "remaining") {
        const { curDesc } = req.body;
        const data = await RemainingModel.findById(_id);
        if (data == null) {
          throw new Error("No data found");
        }
        data.desc = curDesc;
        await data.save();
        res.json({ message: "Successfully edited the description !" });
      } else {
        const { curDesc } = req.body;
        const data = await MasteredModel.findById(_id);
        if (data == null) {
          throw new Error("No data found");
        }
        data.desc = curDesc;
        await data.save();
        res.json({ message: "Successfully edited the description !" });
      }
    } catch (e) {
      res.json({ message: "Here's the error " + e.message });
    }
  }
);

profileRouter.post("/profile/:type/:_id", userAuth, async (req, res) => {
  try {
    const { type, _id } = req.params;
    console.log("IsValidObjectId:", mongoose.Types.ObjectId.isValid(_id));
    const allowedType = ["remaining", "mastered"];
    if (!allowedType.includes(type)) {
      throw new Error("There's no such type exist");
    }
    if (type === "remaining") {
      const data = await RemainingModel.findByIdAndDelete(_id);

      if (!data) {
        throw new Error("Document not found in Remaining collection");
      }
      const newMastered = new MasteredModel({
        qid: data.qid,
        desc: data.desc,
        uid: data.uid,
        desc: data.desc,
      });
      await newMastered.save();
      res.json({
        message: "Question moved successfully from Remaining to Matered",
      });
    } else {
      const data = await MasteredModel.findByIdAndDelete(_id);

      if (!data) {
        throw new Error("Document not found in Mastered collection");
      }
      const newRemaining = new RemainingModel({
        qid: data.qid,
        desc: data.desc,
        uid: data.uid,
        desc: data.desc,
      });
      await newRemaining.save();
      res.json({
        message: "Question moved successfully from Mastered to Remaining",
      });
    }
  } catch (e) {
    res.json({ message: "there was an error " + e.message });
  }
});

module.exports = { profileRouter };
