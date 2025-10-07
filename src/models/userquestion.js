const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const userQuestionSchema = new Schema(
  {
    qid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "QuestionModel",
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserModel",
    },
    desc: { type: String },
  },
  { timestamps: true }
);

const RemainingModel = model("RemainingModel", userQuestionSchema);
const MasteredModel = model("MasteredModel", userQuestionSchema);

module.exports = { RemainingModel, MasteredModel };
