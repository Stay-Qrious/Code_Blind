const { Schema, model } = require("mongoose");

const questionSchema = new Schema(
  {
    questionName: {
      type: String,
      required: true,
    },
    questionLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const QuestionModel = new model("QuestionModel", questionSchema);
module.exports = { QuestionModel };
